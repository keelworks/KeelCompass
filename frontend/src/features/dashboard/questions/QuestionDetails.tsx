import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaRegCommentDots, FaCheckCircle } from "react-icons/fa";
import { FiMaximize2, FiChevronUp } from "react-icons/fi";
import { formatDateTime, capitalizeWords } from "../../../utils/format";
import {
  Comment,
  Interest,
  QuestionDetail,
  UserActionType,
} from "../../../utils/types";
import { useAttachmentBlobUrl } from "../../../utils/useAttachmentBlobUrl";
import { useAutoGrowTextarea } from "../../../utils/useAutoGrowTextarea";
import {
  getQuestion,
  createUserQuestionAction,
  deleteUserQuestionAction,
  createInterest,
  deleteInterest,
  updateQuestion,
  deleteQuestion,
  setAcceptedAnswer,
  toggleQuestionPin,
  muteQuestion,
  unmuteQuestion,
  getMe,
} from "../../../utils/store";
import Button from "../../../components/ui/Button";
import ThreeDotsMenu from "../../../components/ui/ThreeDotsMenu";
import AuthorHeader from "../../../components/ui/AuthorHeader";
import LikeButton from "../../../components/ui/LikeButton";
import ImageLightbox from "../../../components/ui/ImageLightbox";
import EditHistoryModal from "../../../components/ui/EditHistoryModal";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import CommentItem from "./CommentItem";
import CommentCreate from "./CommentCreate";
import RichContent from "../../../components/ui/RichContent";
import { highlightMentionsReact } from "../../../utils/mentionHighlight";
import { useToast } from "../../../utils/useToast";

interface QuestionDetailsProps {
  questionId: number;
  onQuestionUpdate?: (updated: { id: number; title: string; description: string }) => void;
  onQuestionDelete?: (deletedId: number) => void;
  onQuestionLike?: (questionId: number, hasLiked: boolean, likeCount: number) => void;
  interests: Interest[];
  setInterests: (interests: Interest[]) => void;
  onInterestsUpdate: () => void;
  onCommentCreate?: (questionId: number) => void;
  onCommentDelete?: (questionId: number) => void;
  onClose?: () => void;
  // "modal" (default) is the popup used from post lists; "page" renders the
  // same content inline, either for the fullscreen /questions/:id route, or
  // for an accordion-style expanded row in a list (pass onCollapse for that)
  variant?: "modal" | "page";
  // when provided, shows a collapse control (used when this is an expanded
  // row in an accordion-style list, as opposed to the standalone page route)
  onCollapse?: () => void;
  // fires once the question's title is known/changes, so a standalone page
  // route can reflect it in the browser tab title
  onTitleChange?: (title: string) => void;
}

// walk the threaded comment tree to find the chain of ancestor ids leading
// down to targetId - every id in that chain needs its replies expanded for
// the target to actually be visible
function findAncestorChain(nodes: Comment[], targetId: number, path: number[] = []): number[] | null {
  for (const node of nodes) {
    if (node.id === targetId) return path;
    if (node.replies && node.replies.length > 0) {
      const found = findAncestorChain(node.replies, targetId, [...path, node.id]);
      if (found) return found;
    }
  }
  return null;
}

// find a comment anywhere in the threaded tree by id (used to feature the
// accepted answer at the top regardless of how deep it actually lives)
function findCommentById(nodes: Comment[], targetId: number): Comment | null {
  for (const node of nodes) {
    if (node.id === targetId) return node;
    if (node.replies && node.replies.length > 0) {
      const found = findCommentById(node.replies, targetId);
      if (found) return found;
    }
  }
  return null;
}

function QuestionDetails({
  questionId,
  onQuestionUpdate,
  onQuestionDelete,
  onQuestionLike,
  interests,
  setInterests,
  onInterestsUpdate,
  onCommentCreate,
  onCommentDelete,
  onClose,
  variant = "modal",
  onCollapse,
  onTitleChange,
}: QuestionDetailsProps) {
  const isPage = variant === "page";
  const userId = Number(localStorage.getItem("userId"));
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const editDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const { showError, showSuccess, toastNode } = useToast();

  const [question, setQuestion] = useState<QuestionDetail | null>(null);
  // a newly-chosen replacement file while editing (not sent at all unless
  // the author actually picks one - see handleSubmitQuestionEdit)
  const [newAttachment, setNewAttachment] = useState<File | null>(null);
  // explicit "remove the existing attachment" request while editing -
  // distinct from "no new file chosen", which now leaves it untouched
  const [removeExistingAttachment, setRemoveExistingAttachment] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [showAllReplies, setShowAllReplies] = useState(isPage);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [highlightTarget, setHighlightTarget] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [editHistoryOpen, setEditHistoryOpen] = useState(false);

  useAutoGrowTextarea(editDescriptionRef, editForm.description, 400);

  useEffect(() => {
    if (question?.title) onTitleChange?.(question.title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.title]);

  // the existing attachment (if any) is only ever metadata + a URL now - the
  // bytes live on the server's disk, fetched through an authenticated
  // request so tag-based post visibility still applies to it
  const existingAttachmentUrl = useAttachmentBlobUrl(question?.attachment);

  const currentInterest = interests.find((i) => i.question_id === questionId);
  const isInterested = !!currentInterest;
  const interestId = currentInterest?.id;

  const buildThreadedComments = (flat: Comment[]): Comment[] => {
    const map = new Map<number, Comment>();
    const topLevel: Comment[] = [];
    flat.forEach((c) => map.set(c.id, { ...c, replies: [] }));
    flat.forEach((c) => {
      const node = map.get(c.id);
      if (!node) return;
      if (c.parentId === null || c.parentId === undefined) {
        topLevel.push(node);
      } else {
        const parent = map.get(c.parentId);
        parent?.replies?.push(node);
      }
    });
    return topLevel;
  };

  const fetchQuestion = async () => {
    try {
      const res = await getQuestion({ id: questionId });
      if (res.comments && res.comments.length > 0) {
        res.comments = buildThreadedComments(res.comments);
      }
      setQuestion(res);
      setNotFound(false);
    } catch (err) {
      console.error(err);
      setQuestion(null);
      setNotFound(true);
    }
  };

  const handleQuestionEdit = () => {
    if (editMode) setEditMode(false);
    else if (question) {
      setEditMode(true);
      setEditForm({ title: question.title, description: question.description });
      setNewAttachment(null);
      setRemoveExistingAttachment(false);
    }
  };

  const handleCancelQuestionEdit = () => {
    setEditMode(false);
    setEditForm({ title: "", description: "" });
    setNewAttachment(null);
    setRemoveExistingAttachment(false);
  };

  const handleSubmitQuestionEdit = async () => {
    if (!question) return;
    try {
      if (newAttachment && newAttachment.size > 10 * 1024 * 1024) {
        showError("Attachment size exceeds 10MB limit.");
        return;
      }
      const updateData: { title: string; description: string; attachment?: File | null; removeAttachment?: boolean } = {
        title: editForm.title,
        description: editForm.description,
      };
      if (newAttachment) updateData.attachment = newAttachment;
      else if (removeExistingAttachment) updateData.removeAttachment = true;

      await updateQuestion({ id: question.id, ...updateData });
      setEditMode(false);
      setNewAttachment(null);
      setRemoveExistingAttachment(false);
      fetchQuestion();
      onQuestionUpdate?.({
        id: question.id,
        title: editForm.title,
        description: editForm.description,
      });
    } catch {
      showError("Failed to update question.");
    }
  };

  const handleQuestionDelete = async () => {
    if (!question) return;
    try {
      await deleteQuestion({ id: question.id });
      onQuestionDelete?.(question.id);
      if (isPage) navigate("/dashboard");
      else onClose?.();
    } catch {
      showError("Failed to delete question.");
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewAttachment(file);
    if (file) setRemoveExistingAttachment(false);
  };

  const handleQuestionLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!question) return;
    const newLiked = !question.hasLiked;
    const newLikes = question.likeCount + (question.hasLiked ? -1 : 1);
    setQuestion({ ...question, hasLiked: newLiked, likeCount: newLikes });
    onQuestionLike?.(question.id, newLiked, newLikes);
    try {
      if (!question.hasLiked) {
        await createUserQuestionAction({ questionId: question.id, actionType: UserActionType.Like });
      } else {
        await deleteUserQuestionAction({ questionId: question.id, actionType: UserActionType.Like });
      }
    } catch {
      showError("Failed to update like status.");
    }
  };

  const handleQuestionInterest = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isInterested) {
      try {
        const newInterest: Interest = await createInterest({ questionId });
        setInterests([...interests, newInterest]);
      } catch {
        showError("Failed to bookmark question.");
      }
    } else {
      if (interestId == null) return;
      try {
        await deleteInterest({ id: interestId });
        setInterests(interests.filter((i) => i.id !== interestId));
      } catch {
        showError("Failed to remove bookmark.");
      }
    }
    onInterestsUpdate();
  };

  const handleCommentCreateLocal = (qid: number) => {
    fetchQuestion();
    setRefreshKey((prev) => prev + 1);
    onCommentCreate?.(qid);
  };

  const handleReplyAdded = () => {
    fetchQuestion();
    setRefreshKey((prev) => prev + 1);
    onCommentDelete?.(questionId);
  };

  const handleAcceptAnswer = async (commentId: number) => {
    const alreadyAccepted = question?.acceptedCommentId === commentId;
    try {
      await setAcceptedAnswer({ questionId, commentId: alreadyAccepted ? null : commentId });
      fetchQuestion();
    } catch {
      showError("Failed to update the accepted answer.");
    }
  };

  const handleReportQuestion = async () => {
    if (!question) return;
    try {
      await createUserQuestionAction({ questionId: question.id, actionType: UserActionType.Report });
      showSuccess("Thank you for reporting! This will be moderated by the admins.");
    } catch {
      showError("Failed to report this post. You may have already reported it.");
    }
  };

  const handleTogglePin = async () => {
    if (!question) return;
    try {
      const result = await toggleQuestionPin(question.id);
      setQuestion({ ...question, pinned: result.pinned });
    } catch {
      showError("Failed to update pin status.");
    }
  };

  const handleMuteToggle = async () => {
    if (!question) return;
    try {
      const result = question.isMuted ? await unmuteQuestion(question.id) : await muteQuestion(question.id);
      setQuestion({ ...question, isMuted: result.muted });
    } catch {
      showError("Failed to update thread notification settings.");
    }
  };

  const jumpToComment = (commentId: number) => {
    setShowAllReplies(true);
    setHighlightTarget(commentId);
  };


  // the accepted answer, wherever it actually lives in the thread, featured
  // at the top of the comments section regardless of depth
  const acceptedComment = useMemo(() => {
    if (!question?.acceptedCommentId || !question.comments) return null;
    return findCommentById(question.comments, question.acceptedCommentId);
  }, [question?.acceptedCommentId, question?.comments]);

  // every ancestor id that must have its replies expanded for the
  // highlighted/deep-linked comment to actually be visible
  const forceExpandIds = useMemo(() => {
    if (!highlightTarget || !question?.comments) return undefined;
    const chain = findAncestorChain(question.comments, highlightTarget);
    return chain ? new Set(chain) : undefined;
  }, [highlightTarget, question?.comments]);

  // fetch question on mount/id change
  useEffect(() => {
    if (typeof questionId !== "number" || isNaN(questionId)) return;
    fetchQuestion();
  }, [questionId]);

  // admins get a Pin option in the post's menu
  useEffect(() => {
    getMe()
      .then((me) => setIsAdmin(me.roles?.includes("admin") ?? false))
      .catch(() => setIsAdmin(false));
  }, []);

  // a #comment-N URL hash (e.g. from a notification) jumps straight to that
  // comment once the thread has loaded
  useEffect(() => {
    if (!question) return;
    const match = window.location.hash.match(/^#comment-(\d+)$/);
    if (match) jumpToComment(Number(match[1]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.id]);

  // close 3-dots menu on outside click inside modal
  useEffect(() => {
    if (!openMenuId) return;
    function handleDocClick(e: MouseEvent) {
      if (
        modalRef.current &&
        modalRef.current.contains(e.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, [openMenuId]);

  const content = (
    <div
      ref={modalRef}
      className={
        isPage
          ? onCollapse
            ? // embedded as an accordion row in a list - the row itself
              // already supplies the card's border/background, so this
              // just needs the padding, not a second nested card
              "relative w-full p-4 sm:p-6 flex flex-col items-center space-y-4 animate-card-in"
            : "relative w-full p-4 sm:p-6 flex flex-col items-center space-y-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm animate-card-in"
          : "relative z-50 p-6 flex flex-col items-center space-y-4 overflow-y-auto overflow-x-hidden max-h-[90vh] cursor-auto bg-white dark:bg-gray-900 animate-modal-in"
      }
      style={
        isPage
          ? { borderRadius: "7px" }
          : { width: "min(676px, 94vw)", borderRadius: "7px", boxShadow: "0px 6px 18px 0px #442756" }
      }
    >
      {/* Content */}
      {question && (
        <>
          <div
            className={
              isPage && onCollapse
                ? // embedded in the accordion list - the row's own border/tint
                  // is the only highlight needed, a second nested color here
                  // just fights with it
                  "w-full text-left"
                : "w-full text-left bg-[#f6f6f6] dark:bg-gray-800 rounded-lg p-6"
            }
          >
            <AuthorHeader
              pictureUrl={question.user.pictureUrl}
              displayName={question.user.displayName || question.user.username}
              email={question.user.email}
              roleTag={question.user.fullRoleTag}
              dateLabel={formatDateTime(question.createdAt)}
              afterDate={
                question.updatedAt && question.updatedAt !== question.createdAt ? (
                  <button
                    type="button"
                    onClick={() => setEditHistoryOpen(true)}
                    className="italic text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline decoration-dotted underline-offset-2 transition-colors duration-150"
                  >
                    (edited)
                  </button>
                ) : undefined
              }
              avatarSize="md"
              rightSlot={
                <div className="flex items-center gap-1 shrink-0">
                  {onCollapse && (
                    <button
                      type="button"
                      onClick={onCollapse}
                      aria-label="Collapse"
                      title="Collapse"
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-150 hover:scale-110 active:scale-95 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-white/10"
                    >
                      <FiChevronUp size={18} />
                    </button>
                  )}
                  {!(isPage && !onCollapse) && (
                    <button
                      type="button"
                      onClick={() => navigate(`/questions/${question.id}`)}
                      aria-label="Open in full screen"
                      title="Open in full screen"
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-150 hover:scale-110 active:scale-95 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-white/10"
                    >
                      <FiMaximize2 size={16} />
                    </button>
                  )}
                  <ThreeDotsMenu
                    menuRef={menuRef}
                    menuId={`question-${question.id}`}
                    openMenuId={openMenuId}
                    setOpenMenuId={setOpenMenuId}
                    handleInterest={handleQuestionInterest}
                    handleReport={handleReportQuestion}
                    handleEdit={handleQuestionEdit}
                    handleDelete={() => setShowDeleteConfirmation(true)}
                    handlePin={handleTogglePin}
                    handleMuteToggle={handleMuteToggle}
                    isMuted={question.isMuted}
                    isAdmin={isAdmin}
                    userId={userId}
                    question={question}
                    isInterested={isInterested}
                  />
                </div>
              }
            />

            {/* Pinned / Solved badges */}
            {(question.pinned || question.solved) && (
              <div className="flex items-center gap-1.5 mt-3">
                {question.pinned && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                    Pinned
                  </span>
                )}
                {question.solved && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                    Solved
                  </span>
                )}
              </div>
            )}

            {/* Title */}
            {editMode ? (
              <input
                className="w-full mt-4 mb-2 p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Title"
              />
            ) : (
              <h3 className="text-lg font-semibold text-brand-900 dark:text-teal-300 mt-4 mb-2 w-full break-words">
                {question.title}
              </h3>
            )}

            {/* Description */}
            {editMode ? (
              <textarea
                ref={editDescriptionRef}
                className="w-full mb-2 p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-900 dark:text-gray-100 resize-none"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Description"
                rows={4}
              />
            ) : (
              <RichContent
                html={question.description || ""}
                className="post-content text-sm text-[#616161] dark:text-gray-300 mb-2 w-full [overflow-wrap:anywhere]"
              />
            )}

            {/* Attachment */}
            {editMode ? (
              <div className="mb-4 mt-3 flex items-center justify-between gap-3">
                {newAttachment ? (
                  <>
                    <FaFileAlt className="mr-2" />
                    <span className="text-sm text-gray-600">
                      {newAttachment.name} ({(newAttachment.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                    <button
                      type="button"
                      className="ml-auto px-3 py-1 bg-gray-200 text-red-500 rounded hover:bg-gray-300 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewAttachment(null);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      Remove
                    </button>
                  </>
                ) : question?.attachment && !removeExistingAttachment ? (
                  <>
                    <FaFileAlt className="mr-2" />
                    <span className="text-sm text-gray-600">{question.attachment.fileName}</span>
                    <button
                      type="button"
                      className="ml-auto px-3 py-1 bg-gray-200 text-red-500 rounded hover:bg-gray-300 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRemoveExistingAttachment(true);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <div className="flex justify-end w-full">
                    <label
                      htmlFor="attachment"
                      style={{
                        paddingLeft: "12px",
                        paddingRight: "12px",
                        paddingTop: "4px",
                        paddingBottom: "4px",
                        backgroundColor: "#3B82F6",
                        color: "#FFFFFF",
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                      }}
                    >
                      Choose File
                    </label>
                    <input
                      id="attachment"
                      className="hidden"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleAttachmentChange}
                    />
                  </div>
                )}
              </div>
            ) : (
              question?.attachment &&
              existingAttachmentUrl &&
              (question.attachment.mimeType.startsWith("image/") ? (
                // images embed inline as a capped-size thumbnail so people
                // can see them without opening anything, and open in a
                // zoomable lightbox on click instead of a bare new tab
                <>
                  <img
                    src={existingAttachmentUrl}
                    alt={question.attachment.fileName}
                    onClick={() => setLightboxOpen(true)}
                    className="max-h-64 max-w-full w-auto rounded-lg border border-gray-200 dark:border-gray-700 mb-4 mt-3 cursor-zoom-in hover:opacity-90 transition-opacity duration-150 animate-card-in"
                  />
                  <ImageLightbox
                    src={existingAttachmentUrl}
                    alt={question.attachment.fileName}
                    isOpen={lightboxOpen}
                    onClose={() => setLightboxOpen(false)}
                  />
                </>
              ) : (
                <div className="flex items-center text-xs text-gray-600 bg-gray-100 rounded px-2 mb-4 mt-3 cursor-pointer hover:bg-gray-200 transition w-fit">
                  <FaFileAlt className="mr-2" />
                  <div
                    className="px-2 py-1"
                    onClick={() => window.open(existingAttachmentUrl, "_blank")}
                  >
                    {question.attachment.fileName}
                  </div>
                </div>
              ))
            )}

            {/* Edit buttons */}
            {editMode && (
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="secondary" onClick={handleCancelQuestionEdit}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmitQuestionEdit}>
                  Save
                </Button>
              </div>
            )}

            {/* Categories/Tags inline on the left, likes/comments on the right - one row */}
            <div className="flex items-end justify-between gap-3 w-full mt-3 flex-wrap">
              <div className="flex flex-wrap items-center gap-1.5">
                {question.categories?.map((cat) => (
                  <span
                    key={cat.id}
                    className="inline-block w-fit text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300"
                  >
                    {cat.name}
                  </span>
                ))}
                {question.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block w-fit text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-brand-50 text-brand-600 dark:bg-teal-900/40 dark:text-teal-300"
                  >
                    #{capitalizeWords(tag)}
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-4 shrink-0">
                <LikeButton liked={question.hasLiked} count={question.likeCount} onToggle={handleQuestionLike} size="md" />
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <FaRegCommentDots className="mr-1" /> {question.commentCount} Comments
                </div>
              </div>
            </div>
          </div>

          {/* Featured accepted answer - surfaced at the top regardless of how deep it lives in the thread */}
          {acceptedComment && (
            <div className="w-full rounded-lg border-2 border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 p-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-green-700 dark:text-green-300 mb-2">
                <FaCheckCircle size={12} /> Accepted Answer
              </div>
              <AuthorHeader
                pictureUrl={acceptedComment.user.pictureUrl}
                displayName={acceptedComment.user.displayName || acceptedComment.user.username}
                email={acceptedComment.user.email}
                roleTag={acceptedComment.user.fullRoleTag}
                dateLabel={formatDateTime(acceptedComment.createdAt)}
              />
              <div className="mt-2 text-sm text-[#616161] dark:text-gray-300">{highlightMentionsReact(acceptedComment.content)}</div>
              <button
                type="button"
                onClick={() => jumpToComment(acceptedComment.id)}
                className="mt-2 text-xs font-medium text-green-700 dark:text-green-300 hover:underline"
              >
                View in thread ↓
              </button>
            </div>
          )}

          {question.comments && question.comments.length > 2 && !showAllReplies && (
            <button
              className="self-start text-sm font-medium border dark:border-gray-600 px-3 py-1 rounded bg-white dark:bg-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-150 hover:scale-[1.02] active:scale-95 mt-4"
              onClick={() => setShowAllReplies(true)}
            >
              Show all replies
            </button>
          )}

          {/* Comments - horizontally scrollable so deeply nested replies never
              get clipped. Vertically, this flows as part of the single
              outer scroll container (the modal's own overflow-y-auto, or
              the page's natural scroll) rather than having its own nested
              scrollbar, which used to make the thread look cut off/smooshed
              against the bottom of a separate little box. */}
          {question.comments && question.comments.length > 0 && (
            <div className="relative w-full mt-4 pl-6 overflow-x-auto">
              {/* same connector trunk used for nested replies, so top-level
                  comments visually branch off the post itself too */}
              <div
                className="absolute left-[9px] top-0 bottom-6 w-0.5 bg-gray-300 dark:bg-gray-600 rounded-full"
                aria-hidden="true"
              />
              {(showAllReplies ? question.comments : question.comments.slice(0, 2)).map((comment) => (
                <div key={`${comment.id}-${refreshKey}`} className="relative">
                  <svg
                    className="absolute -left-6 top-0 text-gray-300 dark:text-gray-600"
                    width="24"
                    height="28"
                    viewBox="0 0 24 28"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M9 0 V14 Q9 22 17 22 H24" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <CommentItem
                    comment={comment}
                    openMenuId={openMenuId}
                    setOpenMenuId={setOpenMenuId}
                    onCommentDelete={handleReplyAdded}
                    questionId={questionId}
                    onReplyAdded={handleReplyAdded}
                    canAcceptAnswer={question.user.id === userId}
                    onAcceptAnswer={handleAcceptAnswer}
                    forceExpandIds={forceExpandIds}
                    highlightCommentId={highlightTarget}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {notFound && (
        <div className="w-full py-12 text-center text-gray-500 dark:text-gray-400">
          <p className="text-base font-medium mb-1">This post isn't available.</p>
          <p className="text-sm">It may have been deleted, or you may not have access to it.</p>
        </div>
      )}

      {/* Create Comment */}
      {question && (
        <div className="w-full flex justify-center mt-6">
          <CommentCreate questionId={questionId} onCommentCreate={handleCommentCreateLocal} />
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        title="Are you sure you want to delete this question?"
        isOpen={showDeleteConfirmation}
        onCancel={() => setShowDeleteConfirmation(false)}
        onConfirm={handleQuestionDelete}
      />
      {toastNode}
      {question && (
        <EditHistoryModal
          entityType="question"
          entityId={question.id}
          isOpen={editHistoryOpen}
          onClose={() => setEditHistoryOpen(false)}
        />
      )}
    </div>
  );

  if (isPage) return content;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-30 cursor-auto animate-backdrop-in"
        style={{ zIndex: 49 }}
        onClick={(e) => {
          e.stopPropagation();
          onClose?.();
        }}
      />
      {content}
    </div>
  );
}

export default QuestionDetails;
