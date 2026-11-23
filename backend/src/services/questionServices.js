const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");
const { normalizeTag, mentionKey } = require("../utils/roleTags");
const { snippet } = require("../utils/textUtils");
const { summarizeReactions } = require("../utils/reactionUtils");

const db = require("../models");
const User = db.User;
const Question = db.Question;
const UserQuestionAction = db.UserQuestionAction;
const Attachment = db.Attachment;
const Comment = db.Comment;
const Category = db.Category;
const Interest = db.Interest;
const QuestionTag = db.QuestionTag;
const RoleTagMapping = db.RoleTagMapping;
const attachmentService = require("./attachmentServices");
const notificationService = require("./notificationServices");
const muteService = require("./muteServices");
const editHistoryService = require("./editHistoryServices");

// list every known tag a question can be restricted to (sourced from the
// admin-managed role mappings, so authors pick from the same tag vocabulary
// Google-derived roles already use)
const getKnownTags = async () => {
  try {
    const mappings = await RoleTagMapping.findAll({
      attributes: ["tag"],
      order: [["tag", "ASC"]],
    });
    return mappings.map((m) => m.tag);
  } catch (error) {
    logEverything(error, "questionServices");
    throw new HttpError(500, "Error fetching known tags");
  }
};

// a tagged question is only visible to a viewer whose own normalized role
// tag matches one of the question's tags, with two exceptions: the
// question's own author can always see their own post, tagged or not, and
// an admin bypasses tag restrictions entirely (isAdmin). An untagged
// question is visible to everyone, which is the only form of "Everyone"
// visibility.
const getHiddenQuestionIds = async (viewerTag, viewerUserId, isAdmin = false) => {
  if (isAdmin) return [];
  const rows = await QuestionTag.findAll({
    attributes: ["question_id", "tag"],
    include: [{ model: Question, as: "question", attributes: ["user_id"] }],
  });
  const byQuestion = new Map();
  for (const row of rows) {
    if (!byQuestion.has(row.question_id)) {
      byQuestion.set(row.question_id, { tags: [], authorId: row.question?.user_id });
    }
    byQuestion.get(row.question_id).tags.push(row.tag);
  }

  const hidden = [];
  for (const [questionId, { tags, authorId }] of byQuestion) {
    if (viewerUserId && authorId === viewerUserId) continue;
    if (!viewerTag || !tags.includes(viewerTag)) hidden.push(questionId);
  }
  return hidden;
};

// single-question version of the same visibility rule above, for anything
// that needs to gate access to one specific question (e.g. serving its
// attachment) without pulling every tagged question's hidden-id list
const canUserViewQuestion = async (questionId, userId, viewerTag, isAdmin = false) => {
  const question = await Question.findByPk(questionId, { attributes: ["id", "user_id", "deleted_at"] });
  if (!question || question.deleted_at) return false;
  if (isAdmin) return true;
  if (userId && question.user_id === userId) return true;

  const tagRows = await QuestionTag.findAll({ where: { question_id: questionId }, attributes: ["tag"] });
  if (tagRows.length === 0) return true;
  return !!viewerTag && tagRows.some((row) => row.tag === viewerTag);
};

// get recent questions
const getRecentQuestions = async (userId, count = 10, offset = 0, viewerTag = null, onlyUnanswered = false, isAdmin = false) => {
  try {
    count = parseInt(count, 10);
    offset = parseInt(offset, 10);
    if (isNaN(count) || count <= 0) count = 10;
    if (isNaN(offset) || offset < 0) offset = 0;

    const hiddenQuestionIds = await getHiddenQuestionIds(viewerTag, userId, isAdmin);
    const { Op } = db.Sequelize;

    const whereClauses = [{ deleted_at: null }];
    if (hiddenQuestionIds.length > 0) whereClauses.push({ id: { [Op.notIn]: hiddenQuestionIds } });
    if (onlyUnanswered) {
      whereClauses.push(
        db.Sequelize.where(
          db.Sequelize.literal(`(SELECT COUNT(*) FROM Comments WHERE Comments.question_id = Question.id)`),
          0
        )
      );
    }

    const { count: totalCount, rows: questions } =
      await Question.findAndCountAll({
        where: { [Op.and]: whereClauses },
        include: [
          { model: User, as: "user", attributes: ["id", "username", "email", "display_name", "picture_url", "full_role_tag"] },
          {
            model: UserQuestionAction,
            as: "userQuestionActions",
            attributes: ["user_id", "action_type"],
          },
          {
            model: Attachment,
            as: "attachment",
            attributes: ["id", "file_name", "mime_type"],
          },
          { model: Comment, as: "comments", attributes: ["id"] },
          { model: Interest, as: "interests", attributes: ["id", "user_id"] },
          { model: Category, attributes: ["id", "name"] }, // Add this line
          { model: QuestionTag, as: "tags", attributes: ["tag"] },
        ],
        order: [["pinned", "DESC"], ["created_at", "DESC"]],
        limit: count,
        offset: offset,
        distinct: true,
      });

    const questionsWithCounts = questions.map((q) => {
      const uqas = Array.isArray(q.userQuestionActions)
        ? q.userQuestionActions
        : [];
      const userInterest = Array.isArray(q.interests)
        ? q.interests.find((i) => i.user_id === userId)
        : null;
      const isInterested = !!userInterest;
      const interestId = isInterested ? userInterest.id : null;
      const { hasLiked, likeCount, myReaction, reactionCounts } = summarizeReactions(uqas, userId);
      const comments = Array.isArray(q.comments) ? q.comments : [];
      const commentCount = comments.length;

      // Map categories to a simple array
      const categories = Array.isArray(q.Categories)
        ? q.Categories.map((cat) => ({ id: cat.id, name: cat.name }))
        : [];
      const tags = Array.isArray(q.tags) ? q.tags.map((t) => t.tag) : [];

      return {
        id: q.id,
        user: {
          username: q.user?.username,
          email: q.user?.email,
          displayName: q.user?.display_name,
          pictureUrl: q.user?.picture_url,
          fullRoleTag: q.user?.full_role_tag,
        },
        title: q.title,
        description: q.description,
        status: q.status,
        createdAt: q.created_at,
        updatedAt: q.updated_at,
        isInterested,
        interestId,
        hasLiked,
        likeCount,
        myReaction,
        reactionCounts,
        commentCount,
        categories, // Add this line
        tags,
        pinned: q.pinned,
        solved: q.solved,
      };
    });

    const nextOffset = offset + questionsWithCounts.length;
    const resOffset = nextOffset >= totalCount ? -1 : nextOffset;
    logger.info(
      `Fetched ${questionsWithCounts.length} recent questions, totalCount: ${totalCount}, resOffset: ${resOffset}`
    );
    return {
      questions: questionsWithCounts,
      total: totalCount,
      offset: resOffset,
    };
  } catch (error) {
    logEverything(error, "questionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error fetching recent questions");
  }
};

// get popular questions
const getPopularQuestions = async (userId, count = 10, offset = 0, viewerTag = null, isAdmin = false) => {
  try {
    const hiddenQuestionIds = await getHiddenQuestionIds(viewerTag, userId, isAdmin);
    const hiddenSet = new Set(hiddenQuestionIds);

    const allQuestions = await Question.findAll({
      where: { deleted_at: null },
      include: [
        { model: User, as: "user", attributes: ["id", "username", "email", "display_name", "picture_url", "full_role_tag"] },
        {
          model: UserQuestionAction,
          as: "userQuestionActions",
          attributes: ["user_id", "action_type"],
        },
        {
          model: Attachment,
          as: "attachment",
          attributes: ["id", "file_name", "mime_type"],
        },
        { model: Comment, as: "comments", attributes: ["id"] },
        { model: Interest, as: "interests", attributes: ["user_id"] },
        { model: QuestionTag, as: "tags", attributes: ["tag"] },
      ],
    });

    const questionsWithScores = allQuestions
      .filter((q) => !hiddenSet.has(q.id))
      .map((q) => {
      const uqas = Array.isArray(q.userQuestionActions)
        ? q.userQuestionActions
        : [];
      const userInterest = Array.isArray(q.interests)
        ? q.interests.find((i) => i.user_id === userId)
        : null;
      const isInterested = !!userInterest;
      const interestId = userInterest ? userInterest.id : null;
      const { hasLiked, likeCount, myReaction, reactionCounts } = summarizeReactions(uqas, userId);
      const comments = Array.isArray(q.comments) ? q.comments : [];
      const commentCount = comments.length;
      const popularityScore = likeCount + commentCount;
      const tags = Array.isArray(q.tags) ? q.tags.map((t) => t.tag) : [];
      return {
        id: q.id,
        user: {
          username: q.user?.username,
          email: q.user?.email,
          displayName: q.user?.display_name,
          pictureUrl: q.user?.picture_url,
          fullRoleTag: q.user?.full_role_tag,
        },
        title: q.title,
        description: q.description,
        status: q.status,
        createdAt: q.created_at,
        updatedAt: q.updated_at,
        isInterested,
        interestId,
        hasLiked,
        likeCount,
        myReaction,
        reactionCounts,
        commentCount,
        popularityScore,
        tags,
        pinned: q.pinned,
        solved: q.solved,
      };
    });

    // pinned posts always lead, regardless of score - that's the point of
    // pinning something; within each group, sort by traction (likes +
    // comments), then recency
    const sortedQuestions = questionsWithScores.sort(
      (a, b) =>
        (Number(b.pinned) - Number(a.pinned)) ||
        b.popularityScore - a.popularityScore ||
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    const pagedQuestions = sortedQuestions.slice(offset, offset + count);
    const resOffset =
      offset + pagedQuestions.length >= sortedQuestions.length
        ? -1
        : offset + pagedQuestions.length;

    return {
      questions: pagedQuestions,
      total: sortedQuestions.length,
      offset: resOffset,
    };
  } catch (error) {
    logEverything(error, "questionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error fetching popular questions");
  }
};

// get pending questions (facilitator)
const getPendingQuestions = async (userId, count = 10, offset = 0) => {
  try {
    count = parseInt(count, 10);
    offset = parseInt(offset, 10);
    if (isNaN(count) || count <= 0) count = 10;
    if (isNaN(offset) || offset < 0) offset = 0;

    const { count: totalCount, rows: questions } =
      await Question.findAndCountAll({
        where: { status: "pending", deleted_at: null },
        include: [
          { model: User, as: "user", attributes: ["id", "username", "email", "display_name", "picture_url", "full_role_tag"] },
          {
            model: UserQuestionAction,
            as: "userQuestionActions",
            attributes: ["user_id", "action_type"],
          },
          {
            model: Attachment,
            as: "attachment",
            attributes: ["id", "file_name", "mime_type"],
          },
          { model: Comment, as: "comments", attributes: ["id"] },
          { model: Interest, as: "interests", attributes: ["id", "user_id"] },
        ],
        order: [["created_at", "DESC"]],
        limit: count,
        offset: offset,
        distinct: true,
      });

    const questionsWithCounts = questions.map((q) => {
      const uqas = Array.isArray(q.userQuestionActions)
        ? q.userQuestionActions
        : [];
      const userInterest = Array.isArray(q.interests)
        ? q.interests.find((i) => i.user_id === userId)
        : null;
      const isInterested = !!userInterest;
      const interestId = isInterested ? userInterest.id : null;
      const { hasLiked, likeCount, myReaction, reactionCounts } = summarizeReactions(uqas, userId);
      const comments = Array.isArray(q.comments) ? q.comments : [];
      const commentCount = comments.length;
      return {
        id: q.id,
        user: {
          username: q.user?.username,
          email: q.user?.email,
          displayName: q.user?.display_name,
          pictureUrl: q.user?.picture_url,
          fullRoleTag: q.user?.full_role_tag,
        },
        title: q.title,
        description: q.description,
        status: q.status,
        createdAt: q.created_at,
        updatedAt: q.updated_at,
        isInterested,
        interestId,
        hasLiked,
        likeCount,
        myReaction,
        reactionCounts,
        commentCount,
      };
    });

    const nextOffset = offset + questionsWithCounts.length;
    const resOffset = nextOffset >= totalCount ? -1 : nextOffset;
    logger.info(
      "Fetched ${questionsWithCounts.length} pending questions, totalCount: ${totalCount}, resOffset: ${resOffset}"
    );
    return {
      questions: questionsWithCounts,
      total: totalCount,
      offset: resOffset,
    };
  } catch (error) {
    logEverything(error, "questionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error fetching pending questions");
  }
};

// get question by id
const getQuestion = async (userId, questionId, viewerTag = null, isAdmin = false) => {
  try {
    const question = await Question.findByPk(questionId, {
      include: [
        { model: User, as: "user", attributes: ["id", "username", "email", "display_name", "picture_url", "full_role_tag"] },
        {
          model: UserQuestionAction,
          as: "userQuestionActions",
          attributes: ["user_id", "action_type"],
        },
        {
          model: Attachment,
          as: "attachment",
          attributes: ["id", "file_name", "mime_type"],
        },
        {
          model: Comment,
          as: "comments",
          include: [
            { model: User, as: "user", attributes: ["id", "username", "email", "display_name", "picture_url", "full_role_tag"] },
            {
              model: Attachment,
              as: "attachment",
              attributes: ["id", "file_name", "mime_type"],
            },
            {
              model: db.UserCommentAction,
              as: "userCommentActions",
              attributes: ["user_id", "action_type"],
            },
          ],
        },
        { model: Interest, as: "interests", attributes: ["id", "user_id"] },
        { model: Category, attributes: ["id", "name"] },
        { model: QuestionTag, as: "tags", attributes: ["tag"] },
      ],
      order: [[{ model: Comment, as: "comments" }, "created_at", "ASC"]],
    });
    if (!question || question.deleted_at) throw new HttpError(404, "Question not found");

    const categories = Array.isArray(question.Categories)
      ? question.Categories.map((cat) => ({ id: cat.id, name: cat.name }))
      : [];
    const tags = Array.isArray(question.tags) ? question.tags.map((t) => t.tag) : [];
    const isAuthor = userId && question.user_id === userId;
    const isVisible = isAdmin || isAuthor || tags.length === 0 || (viewerTag && tags.includes(viewerTag));
    if (!isVisible) throw new HttpError(404, "Question not found");

    const uqas = Array.isArray(question.userQuestionActions)
      ? question.userQuestionActions
      : [];
    const userInterest = Array.isArray(question.interests)
      ? question.interests.find((i) => i.user_id === userId)
      : null;
    const isInterested = !!userInterest;
    const interestId = isInterested ? userInterest.id : null;
    const { hasLiked, likeCount, myReaction, reactionCounts } = summarizeReactions(uqas, userId);
    const comments = Array.isArray(question.comments)
      ? question.comments.map((c) => {
          const ucas = Array.isArray(c.userCommentActions)
            ? c.userCommentActions
            : [];
          const {
            hasLiked: commentHasLiked,
            likeCount: commentLikeCount,
            myReaction: commentMyReaction,
            reactionCounts: commentReactionCounts,
          } = summarizeReactions(ucas, userId);
          const isDeleted = !!c.deleted_at;
          return {
            id: c.id,
            user: isDeleted
              ? { id: null, username: "[deleted]", email: null, displayName: "[deleted]", pictureUrl: null, fullRoleTag: null }
              : {
                  id: c.user?.id,
                  username: c.user?.username,
                  email: c.user?.email,
                  displayName: c.user?.display_name,
                  pictureUrl: c.user?.picture_url,
                  fullRoleTag: c.user?.full_role_tag,
                },
            parentId: c.parent_id,
            content: isDeleted ? "Comment deleted" : c.content,
            isDeleted,
            createdAt: c.created_at,
            updatedAt: c.updated_at,
            attachment: !isDeleted && c.attachment
              ? {
                  id: c.attachment.id,
                  fileName: c.attachment.file_name,
                  mimeType: c.attachment.mime_type,
                  url: `/attachments/${c.attachment.id}/file`,
                }
              : null,
            hasLiked: commentHasLiked,
            likeCount: commentLikeCount,
            myReaction: commentMyReaction,
            reactionCounts: commentReactionCounts,
            isAccepted: question.accepted_comment_id === c.id,
          };
        })
      : [];

    const commentCount = comments.length;

    return {
      id: question.id,
      user: {
        id: question.user?.id,
        username: question.user?.username,
        email: question.user?.email,
        displayName: question.user?.display_name,
        pictureUrl: question.user?.picture_url,
        fullRoleTag: question.user?.full_role_tag,
      },
      title: question.title,
      description: question.description,
      status: question.status,
      createdAt: question.created_at,
      updatedAt: question.updated_at,
      attachment: question.attachment
        ? {
            id: question.attachment.id,
            fileName: question.attachment.file_name,
            mimeType: question.attachment.mime_type,
            url: `/attachments/${question.attachment.id}/file`,
          }
        : null,
      isInterested,
      interestId,
      hasLiked,
      likeCount,
      myReaction,
      reactionCounts,
      comments,
      commentCount,
      categories,
      tags,
      pinned: question.pinned,
      solved: question.solved,
      acceptedCommentId: question.accepted_comment_id,
      isMuted: await muteService.isQuestionMuted(userId, question.id),
    };
  } catch (error) {
    logEverything(error, "questionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error fetching question");
  }
};

// canonicalize/de-dupe a raw tags list into the form stored on QuestionTag
// rows - same punctuation-stripped, lowercased form as RoleTagMappings.tag,
// so a post tagged "Prod. Mgr." and a viewer whose Google name says
// "Prod Mgr." resolve to the same identity
const normalizeTags = (tags) => {
  if (!Array.isArray(tags)) return [];
  const normalized = tags.map((t) => normalizeTag(typeof t === "string" ? t : "")).filter(Boolean);
  return [...new Set(normalized)];
};

// scans free text for @mention tokens (e.g. "@sd", "@everyone", "@prodmgr")
// and notifies the matching group - "@everyone" notifies every user, and
// any other token is matched against the mention-key derived from each
// known role tag (the same normalized tag, with spaces also removed) and
// notifies every user currently holding that tag
const notifyMentions = async (text, questionId, authorUserId) => {
  try {
    const plainText = (text || "").replace(/<[^>]*>/g, " ");
    const mentions = new Set(
      [...plainText.matchAll(/@([a-z0-9]+)/gi)].map((m) => m[1].toLowerCase())
    );
    if (mentions.size === 0) return;

    const link = `/questions/${questionId}`;

    if (mentions.has("everyone")) {
      await notificationService.createNotificationsForAllUsers(
        "mention",
        "You were mentioned (@everyone) in a post.",
        link,
        authorUserId,
        { questionId }
      );
    }

    const roleMentions = [...mentions].filter((m) => m !== "everyone");
    if (roleMentions.length === 0) return;

    const users = await User.findAll({ attributes: ["id", "raw_role_tag"] });
    const matchedUserIds = users
      .filter((u) => {
        const key = mentionKey(u.raw_role_tag);
        return key && roleMentions.includes(key);
      })
      .map((u) => u.id)
      .filter((id) => id !== authorUserId);

    if (matchedUserIds.length > 0) {
      await notificationService.createNotificationsForUsers(
        matchedUserIds,
        "mention",
        `You were mentioned (@${roleMentions.join(", @")}) in a post.`,
        link,
        { questionId }
      );
    }
  } catch (err) {
    logger.error(`Failed to process @mentions for question ${questionId}: ${err.message}`);
  }
};

// create question
const createQuestion = async (
  userId,
  categoryIds,
  title,
  description,
  attachment = null,
  tags = [],
  mentionedUserIds = []
) => {
  try {
    const newQuestion = await Question.create({
      user_id: userId,
      title: title,
      description: description,
    });

    // set categories
    if (categoryIds && categoryIds.length > 0) {
      await newQuestion.setCategories(categoryIds);
    }

    // set tags (restricts visibility to users with a matching raw role tag)
    const normalizedTags = normalizeTags(tags);
    if (normalizedTags.length > 0) {
      await QuestionTag.bulkCreate(
        normalizedTags.map((tag) => ({ question_id: newQuestion.id, tag }))
      );
    }

    // create attachment
    if (attachment) {
      await attachmentService.createAttachment(attachment, {
        question_id: newQuestion.id,
      });
    }

    logger.info(`Question created successfully with ID: ${newQuestion.id}`);
    await notifyMentions(`${title} ${description}`, newQuestion.id, userId);

    // explicit @mentions picked from the autocomplete directory
    const mentionIds = [...new Set((mentionedUserIds || []).map(Number))].filter(
      (id) => id && id !== userId
    );
    if (mentionIds.length > 0) {
      const actor = await User.findByPk(userId, { attributes: ["display_name", "username"] });
      const actorName = actor?.display_name || actor?.username || "Someone";
      await notificationService.createNotificationsForUsers(
        mentionIds,
        "mention",
        `${actorName} mentioned you in a post: "${snippet(title, 60)}"`,
        `/questions/${newQuestion.id}`,
        { sourceType: "question_mention", sourceId: newQuestion.id, actorUserId: userId, questionId: newQuestion.id }
      );
    }
    return newQuestion.id;
  } catch (error) {
    logEverything(error, "questionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error creating question");
  }
};

// update question by id
const updateQuestion = async (
  userId,
  questionId,
  title,
  description,
  attachment = null,
  tags,
  removeAttachment = false
) => {
  try {
    const question = await Question.findByPk(questionId);
    if (!question) throw new HttpError(404, "Question not found");
    if (question.user_id !== userId)
      throw new HttpError(401, "No permission to update question");

    if (question.title !== title || question.description !== description) {
      await editHistoryService.recordEdit("question", question.id, question.title, question.description);
    }

    question.title = title;
    question.description = description;
    await question.save();

    // replace tags, only if the caller actually sent a tags field
    if (tags !== undefined) {
      await QuestionTag.destroy({ where: { question_id: question.id } });
      const normalizedTags = normalizeTags(tags);
      if (normalizedTags.length > 0) {
        await QuestionTag.bulkCreate(
          normalizedTags.map((tag) => ({ question_id: question.id, tag }))
        );
      }
    }

    // update attachment
    const existingAttachment = await Attachment.findOne({
      where: { question_id: question.id },
    });
    if (attachment) {
      if (existingAttachment) {
        await attachmentService.deleteAttachment(existingAttachment.id);
      }
      await attachmentService.createAttachment(attachment, {
        question_id: question.id,
      });
    } else if (removeAttachment && existingAttachment) {
      await attachmentService.deleteAttachment(existingAttachment.id);
    }
    // no new file and no explicit removal request - leave the existing
    // attachment (if any) untouched instead of deleting it by default

    logger.info(`Question ${questionId} updated successfully`);
    await notifyMentions(`${title} ${description}`, question.id, userId);
    return question.id;
  } catch (error) {
    logEverything(error, "questionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error updating question");
  }
};

// update question status (facilitator)
const updateQuestionStatus = async (questionId, status) => {
  try {
    const question = await Question.findByPk(questionId);
    if (!question) throw new HttpError(404, "Question not found");

    question.status = status;
    await question.save();

    logger.info(`Question ${questionId} status updated to ${status}`);
    return question.id;
  } catch (error) {
    logEverything(error, "questionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error updating question status");
  }
};

// soft-delete a question by id - the author or an admin can do this; the
// post is excluded from all normal reads but can be restored later
const deleteQuestion = async (userId, questionId, isAdmin = false) => {
  try {
    const question = await Question.findByPk(questionId);
    if (!question) throw new HttpError(404, "Question not found");
    if (question.user_id !== userId && !isAdmin)
      throw new HttpError(401, "No permission to delete question");

    // a deleted post shouldn't leave notifications pointing at content that
    // no longer exists - clean up everything sourced from it, question-level
    // and every one of its comments (soft-delete leaves the comment rows in
    // place, so this has to be done explicitly rather than relying on cascade)
    try {
      for (const sourceType of ["question_reaction", "question_report", "question_mention", "answer_accepted"]) {
        await notificationService.deleteNotificationsBySource(sourceType, question.id);
      }
      const comments = await Comment.findAll({ where: { question_id: question.id }, attributes: ["id"], raw: true });
      for (const { id } of comments) {
        await notificationService.deleteNotificationsBySource("comment_created", id);
        await notificationService.deleteNotificationsBySource("comment_reaction", id);
        await notificationService.deleteNotificationsBySource("comment_report", id);
      }
    } catch (err) {
      logger.error(`Failed to clean up notifications for deleted question ${questionId}: ${err.message}`);
    }

    question.deleted_at = new Date();
    await question.save();
    logger.info(`Question ${questionId} soft-deleted`);
    return questionId;
  } catch (error) {
    logEverything(error, "questionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error deleting question.");
  }
};

// list soft-deleted questions (admin only)
const getDeletedQuestions = async () => {
  try {
    const questions = await Question.findAll({
      where: { deleted_at: { [db.Sequelize.Op.ne]: null } },
      include: [{ model: User, as: "user", attributes: ["id", "username", "email"] }],
      order: [["deleted_at", "DESC"]],
    });
    return questions.map((q) => ({
      id: q.id,
      title: q.title,
      deletedAt: q.deleted_at,
      user: { id: q.user?.id, username: q.user?.username, email: q.user?.email },
    }));
  } catch (error) {
    logEverything(error, "questionServices");
    throw new HttpError(500, "Error retrieving deleted questions");
  }
};

// restore a soft-deleted question (admin only)
const restoreQuestion = async (questionId) => {
  try {
    const question = await Question.findByPk(questionId);
    if (!question) throw new HttpError(404, "Question not found");
    question.deleted_at = null;
    await question.save();
    logger.info(`Question ${questionId} restored`);
    return questionId;
  } catch (error) {
    logEverything(error, "questionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error restoring question");
  }
};

// mark/unmark a comment as the accepted answer - the question's author or
// an admin can do this; passing commentId: null clears it
const setAcceptedAnswer = async (userId, isAdmin, questionId, commentId) => {
  try {
    const question = await Question.findByPk(questionId);
    if (!question) throw new HttpError(404, "Question not found");
    if (question.user_id !== userId && !isAdmin) {
      throw new HttpError(401, "Only the question's author can mark an accepted answer");
    }

    // whether re-accepting a different comment or un-accepting entirely,
    // clear any notification from a previous acceptance on this question
    // first so people aren't left with a stale "your answer was accepted"
    if (question.accepted_comment_id && question.accepted_comment_id !== commentId) {
      await notificationService.deleteNotificationsBySource("answer_accepted", question.id);
    }

    if (commentId) {
      const comment = await Comment.findByPk(commentId);
      if (!comment || comment.question_id !== question.id) {
        throw new HttpError(400, "Comment does not belong to this question");
      }
      question.solved = true;
      question.accepted_comment_id = commentId;
      if (comment.user_id !== question.user_id) {
        // +5 reputation for having an answer accepted
        await User.increment("reputation_points", { by: 5, where: { id: comment.user_id } });
        await notificationService.createNotification(
          comment.user_id,
          "approved",
          `Your answer was accepted: "${snippet(question.title, 50)}"`,
          `/questions/${question.id}#comment-${comment.id}`,
          { sourceType: "answer_accepted", sourceId: question.id, actorUserId: userId, questionId: question.id }
        );
      }
    } else {
      question.solved = false;
      question.accepted_comment_id = null;
    }
    await question.save();
    logger.info(`Question ${questionId} accepted answer set to comment ${commentId ?? "(none)"}`);
    return { solved: question.solved, acceptedCommentId: question.accepted_comment_id };
  } catch (error) {
    logEverything(error, "questionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error setting accepted answer");
  }
};

// toggle a question's pinned state (admin only)
const togglePin = async (questionId) => {
  try {
    const question = await Question.findByPk(questionId);
    if (!question) throw new HttpError(404, "Question not found");
    question.pinned = !question.pinned;
    await question.save();
    logger.info(`Question ${questionId} pinned set to ${question.pinned}`);
    return question.pinned;
  } catch (error) {
    logEverything(error, "questionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error toggling pin");
  }
};

// lightweight duplicate-question check: scores existing approved question
// titles against the given title by word overlap (Jaccard similarity) and
// returns the closest matches above a threshold, so the Ask Question form
// can nudge "this might already be answered"
const getSimilarQuestions = async (title) => {
  try {
    const words = (title || "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .split(/\s+/)
      .filter((w) => w.length > 2);
    if (words.length === 0) return [];
    const wordSet = new Set(words);

    const candidates = await Question.findAll({
      where: { deleted_at: null },
      attributes: ["id", "title"],
      limit: 500,
      order: [["created_at", "DESC"]],
    });

    const scored = candidates
      .map((q) => {
        const candidateWords = new Set(
          q.title
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\s]/gu, "")
            .split(/\s+/)
            .filter((w) => w.length > 2)
        );
        const intersection = [...wordSet].filter((w) => candidateWords.has(w)).length;
        const union = new Set([...wordSet, ...candidateWords]).size;
        const score = union === 0 ? 0 : intersection / union;
        return { id: q.id, title: q.title, score };
      })
      .filter((c) => c.score >= 0.3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return scored;
  } catch (error) {
    logEverything(error, "questionServices");
    throw new HttpError(500, "Error finding similar questions");
  }
};

// list every (non-deleted) question for the admin posts/bulk-actions view
const getAllQuestionsForAdmin = async () => {
  try {
    const questions = await Question.findAll({
      where: { deleted_at: null },
      include: [
        { model: User, as: "user", attributes: ["id", "username", "email"] },
        { model: QuestionTag, as: "tags", attributes: ["tag"] },
      ],
      order: [["created_at", "DESC"]],
      limit: 500,
    });
    return questions.map((q) => ({
      id: q.id,
      title: q.title,
      status: q.status,
      pinned: q.pinned,
      solved: q.solved,
      createdAt: q.created_at,
      tags: Array.isArray(q.tags) ? q.tags.map((t) => t.tag) : [],
      user: { id: q.user?.id, username: q.user?.username, email: q.user?.email },
    }));
  } catch (error) {
    logEverything(error, "questionServices");
    throw new HttpError(500, "Error retrieving questions");
  }
};

// bulk-approve/reject a set of questions (admin only)
const bulkUpdateStatus = async (questionIds, status) => {
  try {
    await Question.update({ status }, { where: { id: questionIds } });
    logger.info(`Bulk status update: [${questionIds.join(", ")}] -> ${status}`);
    return questionIds.length;
  } catch (error) {
    logEverything(error, "questionServices");
    throw new HttpError(500, "Error bulk-updating question status");
  }
};

// bulk-add tags to a set of questions (admin only) - adds to whatever tags
// each question already has, rather than replacing them
const bulkAddTags = async (questionIds, tags) => {
  try {
    const normalizedTags = normalizeTags(tags);
    if (normalizedTags.length === 0) return 0;

    const existing = await QuestionTag.findAll({ where: { question_id: questionIds } });
    const existingSet = new Set(existing.map((t) => `${t.question_id}::${t.tag}`));

    const rowsToInsert = [];
    for (const questionId of questionIds) {
      for (const tag of normalizedTags) {
        if (!existingSet.has(`${questionId}::${tag}`)) {
          rowsToInsert.push({ question_id: questionId, tag });
        }
      }
    }
    if (rowsToInsert.length > 0) await QuestionTag.bulkCreate(rowsToInsert);
    logger.info(`Bulk-tagged questions [${questionIds.join(", ")}] with [${normalizedTags.join(", ")}]`);
    return rowsToInsert.length;
  } catch (error) {
    logEverything(error, "questionServices");
    throw new HttpError(500, "Error bulk-tagging questions");
  }
};

module.exports = {
  getRecentQuestions,
  getPopularQuestions,
  getPendingQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  updateQuestionStatus,
  deleteQuestion,
  getKnownTags,
  getDeletedQuestions,
  restoreQuestion,
  setAcceptedAnswer,
  togglePin,
  getSimilarQuestions,
  getAllQuestionsForAdmin,
  bulkUpdateStatus,
  bulkAddTags,
  canUserViewQuestion,
  getQuestionEditHistory: (questionId) => editHistoryService.getEditHistory("question", questionId),
};
