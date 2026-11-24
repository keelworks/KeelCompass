const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");

const db = require("../models");
const Question = db.Question;
const Comment = db.Comment;
const User = db.User;
const QuestionTag = db.QuestionTag;
const attachmentService = require("./attachmentServices");
const interestService = require("./interestServices");
const notificationService = require("./notificationServices");
const editHistoryService = require("./editHistoryServices");
const { snippet } = require("../utils/textUtils");
const { resolveUsersByRoleTag } = require("../utils/mentionUtils");

// create comment. `mentionedUserIds` are the people explicitly tagged via
// the @mention autocomplete while composing - a direct, reliable way to
// notify specific people, instead of re-parsing free text after the fact.
// `mentionedGroupTags` are role tags (e.g. "SD") picked the same way, which
// notify everyone currently holding that tag.
const createComment = async (
  userId,
  questionId,
  content,
  parentId = null,
  attachment = null,
  mentionedUserIds = [],
  mentionedGroupTags = []
) => {
  try {
    const question = await Question.findByPk(questionId);
    if (!question) throw new HttpError(404, "Question not found");
    if (parentId) {
      const parentComment = await Comment.findByPk(parentId);
      if (!parentComment) throw new HttpError(400, "Parent comment not found");
      // questionId can arrive as a string (multipart/form-data) or a number
      // (JSON) depending on the caller, so compare numerically rather than
      // with strict equality - otherwise every multipart reply would be
      // rejected as belonging to "a different question"
      if (Number(parentComment.question_id) !== Number(questionId)) throw new HttpError(400, "Parent comment does not belong to the same question");
    }

    const newComment = await Comment.create({
      user_id: userId,
      question_id: questionId,
      parent_id: parentId,
      content: content,
    });

    // create attachment
    if (attachment) {
      await attachmentService.createAttachment(attachment, { comment_id: newComment.id });
    }

    // create notification
    try {
      const actor = await User.findByPk(userId, { attributes: ["display_name", "username"] });
      const actorName = actor?.display_name || actor?.username || "Someone";
      const contentSnippet = snippet(content, 60);
      const postTitle = snippet(question?.title || "", 40);

      // all notifications caused by this comment are tagged with it as their
      // source, so deleting the comment later can clean them all up at once
      const commentSource = { sourceType: "comment_created", sourceId: newComment.id, actorUserId: userId, questionId };
      const targetUrl = `/questions/${questionId}#comment-${newComment.id}`;

      if (parentId) {
        const parentComment = await Comment.findByPk(parentId);
        if (parentComment && parentComment.user_id !== userId) {
          await notificationService.createNotification(
            parentComment.user_id,
            "commented",
            `${actorName} replied to your comment on "${postTitle}": "${contentSnippet}"`,
            targetUrl,
            commentSource
          );
        }
      } else {
        if (question && question.user_id !== userId) {
          await notificationService.createNotification(
            question.user_id,
            "commented",
            `${actorName} commented on "${postTitle}": "${contentSnippet}"`,
            targetUrl,
            commentSource
          );
        }
      }

      // "follow a question": anyone who bookmarked it also gets notified of
      // any new top-level comment, not just the question's own author
      const followers = await interestService.getInterestsByQuestionId(questionId);
      const followerIds = followers
        .map((f) => f.user_id)
        .filter((id) => id !== userId && id !== question?.user_id);
      if (followerIds.length > 0) {
        await notificationService.createNotificationsForUsers(
          followerIds,
          "commented",
          `${actorName} commented on "${postTitle}" (which you bookmarked): "${contentSnippet}"`,
          targetUrl,
          commentSource
        );
      }

      // explicit @mentions from the autocomplete - reuses the comment's own
      // source tag so deleting the comment cleans these up too. Individual
      // people and role-tag groups both resolve into the same user-id set so
      // nobody gets double-notified for being named both ways.
      //
      // a tagged (restricted-visibility) post may only have its own tags
      // mentioned as a group here - mentioning an unrelated group would
      // notify people who can't even see the post. This re-checks server
      // side regardless of what the picker offered, the same way visibility
      // itself isn't just a UI-level restriction. An untagged (open/
      // everyone) post has nothing to restrict.
      const postTagRows = await QuestionTag.findAll({ where: { question_id: questionId }, attributes: ["tag"] });
      const postTags = postTagRows.map((r) => r.tag.toLowerCase());
      const requestedGroupTags = (mentionedGroupTags || []).filter((tag) => typeof tag === "string" && tag.trim());
      const allowedGroupTags =
        postTags.length > 0
          ? requestedGroupTags.filter((tag) => postTags.includes(tag.toLowerCase()))
          : requestedGroupTags;

      const explicitIds = (mentionedUserIds || []).map(Number).filter((id) => id && id !== userId);
      const groupIdSets = await Promise.all(allowedGroupTags.map(resolveUsersByRoleTag));
      const mentionIds = [...new Set([...explicitIds, ...groupIdSets.flat()])].filter((id) => id !== userId);
      if (mentionIds.length > 0) {
        await notificationService.createNotificationsForUsers(
          mentionIds,
          "mention",
          `${actorName} mentioned you in a comment on "${postTitle}": "${contentSnippet}"`,
          targetUrl,
          commentSource
        );
      }
    } catch (err) {
      logger.error(`Failed to create comment notification: ${err.message}`);
    }
    logger.info(`Comment created successfully with ID: ${newComment.id}`);
    return newComment.id;
  } catch (error) {
    logEverything(error, "commentServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error creating comment");
  }
};

// update comment by id
const updateCommentById = async (userId, commentId, content, attachment = null) => {
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new HttpError(404, "Comment not found");
    if (comment.deleted_at) throw new HttpError(400, "This comment has been deleted");
    if (comment.user_id !== userId) throw new HttpError(401, "No permission to edit");

    if (comment.content !== content) {
      await editHistoryService.recordEdit("comment", comment.id, null, comment.content);
    }

    comment.content = content;
    await comment.save();

    // update attachment
    if (attachment) {
      const existingAttachment = await attachmentService.getAttachmentByOwner({ comment_id: commentId });
      if (existingAttachment) {
        await attachmentService.deleteAttachment(existingAttachment.id);
        logger.info(`Deleted existing attachment for comment ${commentId}`);
      }
      await attachmentService.createAttachment(attachment, { comment_id: commentId });
      logger.info(`Created new attachment for comment ${commentId}`);
    }

    // notify interested users
    try {
      const interests = await interestService.getInterestsByCommentId(commentId);
      const userIds = interests
        .map(i => i.user_id)
        .filter(uid => uid !== userId);
      if (userIds.length > 0) {
        await notificationService.createNotificationsForUsers(
          userIds,
          "update",
          "A comment you bookmarked was updated.",
          `/questions/${comment.question_id}#comment-${commentId}`,
          { questionId: comment.question_id }
        );
        logger.info(`Notified ${userIds.length} users about update to comment ${commentId}`);
      }
    } catch (err) {
      logger.error(`Failed to notify bookmarked users on comment update: ${err.message}`);
    }
    logger.info(`Comment ${commentId} updated successfully`);
    return commentId;
  } catch (error) {
    logEverything(error, "commentServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error updating comment");
  }
}

// delete comment by id - soft delete only: the row (and its replies) stay
// in place so the thread underneath it keeps working, it just renders as a
// "[deleted]" tombstone from here on (see getQuestion's comment mapping)
const deleteCommentById = async (userId, commentId, isAdmin = false) => {
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new HttpError(404, "Comment not found");
    if (comment.deleted_at) throw new HttpError(400, "This comment has already been deleted");
    if (comment.user_id !== userId && !isAdmin) throw new HttpError(401, "No permission to delete");

    // clear notifications this specific comment caused (its replies are
    // untouched and keep their own notifications, since they're not deleted)
    try {
      await notificationService.deleteNotificationsBySource("comment_created", commentId);
      await notificationService.deleteNotificationsBySource("comment_reaction", commentId);
      await notificationService.deleteNotificationsBySource("comment_report", commentId);
    } catch (err) {
      logger.error(`Failed to clean up notifications for deleted comment ${commentId}: ${err.message}`);
    }

    comment.deleted_at = new Date();
    await comment.save();
    logger.info(`Comment ${commentId} soft-deleted`);
    return commentId;
  } catch (error) {
    logEverything(error, "commentServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error deleting comment");
  }
};


module.exports = {
  createComment,
  updateCommentById,
  deleteCommentById,
  getCommentEditHistory: (commentId) => editHistoryService.getEditHistory("comment", commentId),
};
