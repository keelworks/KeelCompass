import { useState, useRef, useEffect } from 'react';
import { FaRegCommentDots, FaCheckCircle } from 'react-icons/fa';
import { formatDateTime } from '../../../utils/format';
import { Comment, UserActionType } from '../../../utils/types';
import { ReactionType } from '../../../utils/reactions';
import {
 createUserCommentAction,
 deleteUserCommentAction,
 updateComment,
 deleteComment,
 createReply
} from '../../../utils/store';
import Button from '../../../components/ui/Button';
import ThreeDotsMenu from '../../../components/ui/ThreeDotsMenu';
import AuthorHeader from '../../../components/ui/AuthorHeader';
import ReactionButton from '../../../components/ui/ReactionButton';
import MentionDropdown from '../../../components/ui/MentionDropdown';
import MentionOverlay from '../../../components/ui/MentionOverlay';
import EditHistoryModal from '../../../components/ui/EditHistoryModal';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import { useToast } from '../../../utils/useToast';
import { useMentionAutocomplete } from '../../../utils/useMentionAutocomplete';
import { useAutoGrowTextarea } from '../../../utils/useAutoGrowTextarea';
import { highlightMentionsReact } from '../../../utils/mentionHighlight';


interface CommentItemProps {
 comment: Comment;
 onCommentDelete?: () => void;
 openMenuId: string | null;
 setOpenMenuId: (id: string | null) => void;
 questionId: number;
 level?: number; // 0 = top level, increments with depth - no cap, threads can go as deep as Reddit-style ladders
 onReplyAdded?: () => void;
 canAcceptAnswer?: boolean;
 onAcceptAnswer?: (commentId: number) => void;
 // ids of comments whose replies should start expanded (the path down to a
 // deep-linked comment, e.g. from a notification or the featured answer card)
 forceExpandIds?: Set<number>;
 // the comment to scroll to and briefly flash-highlight once rendered
 highlightCommentId?: number | null;
}


function CommentItem({
 comment,
 onCommentDelete,
 openMenuId,
 setOpenMenuId,
 questionId,
 level = 0,
 onReplyAdded,
 canAcceptAnswer = false,
 onAcceptAnswer,
 forceExpandIds,
 highlightCommentId,
}: CommentItemProps) {
 const userId = Number(localStorage.getItem('userId'));
 const menuRef = useRef<HTMLDivElement>(null);
 const cardRef = useRef<HTMLDivElement>(null);
 const { showError, showSuccess, toastNode } = useToast();


 const [myReaction, setMyReaction] = useState<ReactionType | null>(
   (comment.myReaction ?? null) as ReactionType | null
 );
 const [reactionCounts, setReactionCounts] = useState(comment.reactionCounts);
 const [likeCount, setLikeCount] = useState(
   typeof comment.likeCount === 'number' ? comment.likeCount : 0
 );
 const [editMode, setEditMode] = useState(false);
 const [editForm, setEditForm] = useState({ content: comment.content });
 const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
 const [editHistoryOpen, setEditHistoryOpen] = useState(false);


 const [isReplying, setIsReplying] = useState(false);
 const [replyContent, setReplyContent] = useState('');
 const [showReplies, setShowReplies] = useState(() => !!forceExpandIds?.has(comment.id));

 // forceExpandIds arrives asynchronously (computed once the question's
 // comments have loaded and a deep-link target is known), so re-check after
 // mount too - a lazy useState initializer alone only ever sees the value
 // from the very first render
 useEffect(() => {
   if (forceExpandIds?.has(comment.id)) setShowReplies(true);
 }, [forceExpandIds, comment.id]);
 const replyMention = useMentionAutocomplete<HTMLTextAreaElement>(replyContent, setReplyContent);
 useAutoGrowTextarea(replyMention.inputRef, replyContent, 240);
 const editTextareaRef = useRef<HTMLTextAreaElement>(null);
 useAutoGrowTextarea(editTextareaRef, editForm.content, 240);

 const isTarget = highlightCommentId === comment.id;
 const [highlighted, setHighlighted] = useState(false);

 const commentNameLabel = comment.user.displayName || comment.user.username;
 const isDeleted = !!comment.isDeleted;

 const canReply = !isDeleted; // anyone, including the comment's own author, can reply - just not to a tombstone
 const replyCount = (comment.replies || []).length;


 const handleCommentEdit = () => {
   if (editMode) {
     setEditMode(false);
   } else {
     setEditMode(true);
     setEditForm({ content: comment.content });
   }
   setOpenMenuId(null);
 };


 const handleCancelCommentEdit = () => {
   setEditMode(false);
   setEditForm({ content: comment.content });
 };


 const handleSubmitCommentEdit = async () => {
   try {
     await updateComment({ id: comment.id, content: editForm.content });
     comment.content = editForm.content;
     setEditMode(false);
   } catch {
     showError('Failed to update comment.');
   }
 };


 const handleCommentDelete = async () => {
   if (!comment) return;
   try {
     await deleteComment({ id: comment.id });
     if (onCommentDelete) onCommentDelete();
     setOpenMenuId(null);
   } catch {
     showError('Failed to delete comment.');
     setOpenMenuId(null);
   }
 };


 const handleReactToComment = async (type: ReactionType) => {
   const previousReaction = myReaction;
   const previousCounts = reactionCounts;
   const previousLikeCount = likeCount;
   const isRemoving = previousReaction === type;
   const newReaction = isRemoving ? null : type;

   const newCounts = { ...(previousCounts || {}) };
   if (previousReaction) {
     newCounts[previousReaction] = Math.max(0, (newCounts[previousReaction] || 0) - 1);
   }
   if (newReaction) {
     newCounts[newReaction] = (newCounts[newReaction] || 0) + 1;
   }
   const newLikeCount = Object.values(newCounts).reduce((sum: number, n) => sum + (n || 0), 0);

   setMyReaction(newReaction);
   setReactionCounts(newCounts);
   setLikeCount(newLikeCount);

   try {
     if (isRemoving) {
       await deleteUserCommentAction({ commentId: comment.id, actionType: type });
     } else {
       await createUserCommentAction({ commentId: comment.id, actionType: type });
     }
   } catch {
     setMyReaction(previousReaction);
     setReactionCounts(previousCounts);
     setLikeCount(previousLikeCount);
     showError('Failed to update your reaction.');
   }
 };


 const handleReply = async () => {
   if (!replyContent.trim()) return;
   try {
     await createReply({
       questionId: questionId,
       content: replyContent,
       parentId: comment.id,
       mentionedUserIds: replyMention.getMentionedUserIds(replyContent),
     });
     setReplyContent('');
     replyMention.resetMentions();
     setIsReplying(false);
     setShowReplies(true); // Show replies after adding
     if (onReplyAdded) onReplyAdded(); // Refresh parent
   } catch {
     showError('Failed to add reply.');
   }
 };


 const handleStartReply = () => {
   setIsReplying(true);
   setOpenMenuId(null);
 };


 const handleCancelReply = () => {
   setIsReplying(false);
   setReplyContent('');
   replyMention.resetMentions();
 };


 const handleReportComment = async () => {
   setOpenMenuId(null);
   try {
     await createUserCommentAction({ commentId: comment.id, actionType: UserActionType.Report });
     showSuccess('Thank you for reporting! This will be moderated by the admins.');
   } catch {
     showError('Failed to report this comment. You may have already reported it.');
   }
 };


 // one consistent card style at every depth - varying it per level used to
 // make nested replies look like a different, disconnected color palette
 // instead of the same conversation continuing


 // close ThreeDotsMenu when clicking outside menu but inside QuestionDetails
 useEffect(() => {
   if (!openMenuId || openMenuId !== `comment-menu-${comment.id}`) return;
   function handleDocClick(e: MouseEvent) {
     if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
       setOpenMenuId(null);
     }
   }
   document.addEventListener('mousedown', handleDocClick);
   return () => {
     document.removeEventListener('mousedown', handleDocClick);
   };
 }, [openMenuId, setOpenMenuId, comment.id]);

 // scroll to and briefly flash this comment if it's the deep-link target
 // (from a notification, or "View in thread" on the featured answer card)
 useEffect(() => {
   if (!isTarget || !cardRef.current) return;
   const timer = setTimeout(() => {
     cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
     setHighlighted(true);
     setTimeout(() => setHighlighted(false), 2200);
   }, 300);
   return () => clearTimeout(timer);
 }, [isTarget]);


 return (
   <>
   <div className="animate-card-in" id={`comment-${comment.id}`}>
     <div
       ref={cardRef}
       className={`w-full bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 mb-3 shadow-sm transition-shadow duration-300 ${
         highlighted ? 'ring-2 ring-brand-600 dark:ring-teal-400' : ''
       }`}
     >
       <div>
         {isDeleted ? (
           <div className="flex items-center gap-2">
             <div className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-xs">
               ✕
             </div>
             <div className="leading-snug">
               <div className="text-sm font-medium text-gray-400 dark:text-gray-500 italic">[deleted]</div>
               <div className="text-xs text-gray-400 dark:text-gray-500">{formatDateTime(comment.createdAt)}</div>
             </div>
           </div>
         ) : (
           <AuthorHeader
             pictureUrl={comment.user.pictureUrl}
             displayName={commentNameLabel}
             email={comment.user.email}
             roleTag={comment.user.fullRoleTag}
             dateLabel={formatDateTime(comment.createdAt)}
             afterDate={
               comment.updatedAt && comment.updatedAt !== comment.createdAt ? (
                 <button
                   type="button"
                   onClick={() => setEditHistoryOpen(true)}
                   className="italic text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline decoration-dotted underline-offset-2 transition-colors duration-150"
                 >
                   (edited)
                 </button>
               ) : undefined
             }
             rightSlot={
               <div className="relative" ref={menuRef}>
                 <ThreeDotsMenu
                   menuRef={menuRef}
                   menuId={`comment-menu-${comment.id}`}
                   openMenuId={openMenuId}
                   setOpenMenuId={setOpenMenuId}
                   handleReport={handleReportComment}
                   handleEdit={handleCommentEdit}
                   handleDelete={() => setShowDeleteConfirmation(true)}
                   handleAcceptAnswer={canAcceptAnswer ? () => onAcceptAnswer?.(comment.id) : undefined}
                   isAccepted={comment.isAccepted}
                   userId={userId}
                   comment={comment}
                 />
               </div>
             }
           />
         )}


         {/* Content */}
         {isDeleted ? (
           <div className="mt-2 text-sm text-gray-400 dark:text-gray-500 italic">Comment deleted</div>
         ) : editMode ? (
           <div className="mt-2">
             <textarea
               ref={editTextareaRef}
               className="w-full p-2 border dark:border-gray-600 rounded mb-2 bg-white dark:bg-gray-800 dark:text-gray-100 resize-none"
               value={editForm.content}
               onChange={(e) => setEditForm({ content: e.target.value })}
               rows={2}
             />
             <div className="flex gap-2 justify-end">
               <Button variant="secondary" onClick={handleCancelCommentEdit}>
                 Cancel
               </Button>
               <Button variant="primary" onClick={handleSubmitCommentEdit}>
                 Save
               </Button>
             </div>
           </div>
         ) : (
           <div className="mt-2 text-sm text-[#616161] dark:text-gray-300">{highlightMentionsReact(comment.content)}</div>
         )}


         {/* NEW: Reply Input */}
         {!isDeleted && isReplying && (
           <div className="relative mt-3 bg-white dark:bg-gray-800 p-3 rounded border-2 border-brand-100 dark:border-teal-800">
             <div className="relative">
               <MentionOverlay
                 text={replyContent}
                 mode="textarea"
                 scrollSourceRef={replyMention.inputRef}
                 className="p-2 text-sm text-gray-900 dark:text-gray-100 leading-normal"
               />
               <textarea
                 ref={replyMention.inputRef}
                 value={replyContent}
                 onChange={(e) =>
                   replyMention.handleChange(e.target.value, e.target.selectionStart ?? e.target.value.length)
                 }
                 onKeyDown={(e) => replyMention.handleKeyDown(e)}
                 placeholder={`Reply to ${comment.user.username}... (type @ to mention someone)`}
                 className="relative w-full border dark:border-gray-600 p-2 rounded text-sm bg-white dark:bg-gray-900 text-transparent caret-gray-900 dark:caret-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-brand-500 dark:focus:border-teal-500 resize-none overflow-y-auto no-scrollbar"
                 rows={2}
               />
             </div>
             {replyMention.isOpen && (
               <MentionDropdown
                 anchorRef={replyMention.inputRef}
                 results={replyMention.results}
                 activeIndex={replyMention.activeIndex}
                 onHover={replyMention.setActiveIndex}
                 onSelect={replyMention.selectMention}
               />
             )}
             <div className="flex justify-end space-x-2 mt-2">
               <Button variant="secondary" size="xs" onClick={handleCancelReply}>
                 Cancel
               </Button>
               <Button variant="primary" size="xs" onClick={handleReply}>
                 Reply
               </Button>
             </div>
           </div>
         )}


         {/* Action buttons */}
         <div className="flex items-center justify-between gap-6 mt-3">
           <div className="flex items-center gap-4">
             {comment.isAccepted && (
               <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 border border-green-300 text-green-700 dark:bg-green-900/40 dark:border-green-700 dark:text-green-300">
                 <FaCheckCircle size={12} />
                 Accepted Answer
               </span>
             )}

             {/*  Reply button */}
             {canReply && (
               <button
                 className="text-sm font-bold text-brand-700 dark:text-teal-300 hover:text-brand-600 dark:hover:text-teal-200 cursor-pointer select-none transition-colors duration-150"
                 onClick={handleStartReply}
               >
                 Reply
               </button>
             )}


             {/*  Show/Hide replies - a single toggle reveals the whole subtree beneath this comment at once */}
             {replyCount > 0 && (
               <button
                 className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer select-none transition-colors duration-150"
                 onClick={() => setShowReplies(!showReplies)}
               >
                 {showReplies ? 'Hide' : 'Show'} {replyCount}{' '}
                 {replyCount === 1 ? 'Reply' : 'Replies'}
               </button>
             )}
           </div>


           <div className="flex items-center gap-6">
             {!isDeleted && (
               <ReactionButton
                 myReaction={myReaction}
                 reactionCounts={reactionCounts}
                 totalCount={likeCount}
                 onReact={handleReactToComment}
               />
             )}
             <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
               <FaRegCommentDots className="mr-1" />
               {replyCount} {replyCount === 1 ? 'Reply' : 'Replies'}
             </div>
           </div>
         </div>
       </div>


       {/* Nested Replies - a smooth curved connector tree (like Reddit/Linear
           threaded comments) that recurses at any depth */}
       {showReplies && (comment.replies || []).length > 0 && (
         <div className="relative mt-2 pl-6 space-y-3 animate-card-in">
           {/* shared trunk running behind every sibling's curve */}
           <div
             className="absolute left-[9px] top-0 bottom-6 w-0.5 bg-gray-300 dark:bg-gray-600 rounded-full"
             aria-hidden="true"
           />
           {(comment.replies || []).map((reply: Comment) => (
             <div key={reply.id} className="relative">
               {/* smooth curve branching off the trunk into this reply */}
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
                 comment={reply}
                 openMenuId={openMenuId}
                 setOpenMenuId={setOpenMenuId}
                 onCommentDelete={onReplyAdded}
                 questionId={questionId}
                 level={level + 1}
                 onReplyAdded={onReplyAdded}
                 canAcceptAnswer={canAcceptAnswer}
                 onAcceptAnswer={onAcceptAnswer}
                 forceExpandIds={forceExpandIds}
                 highlightCommentId={highlightCommentId}
               />
             </div>
           ))}
         </div>
       )}


       {/* Delete Confirmation Modal */}
       <ConfirmDialog
         title="Are you sure you want to delete this comment?"
         isOpen={showDeleteConfirmation}
         onCancel={() => setShowDeleteConfirmation(false)}
         onConfirm={handleCommentDelete}
       />
     </div>
   </div>
   {toastNode}
   <EditHistoryModal
     entityType="comment"
     entityId={comment.id}
     isOpen={editHistoryOpen}
     onClose={() => setEditHistoryOpen(false)}
   />
   </>
 );
}


export default CommentItem;
