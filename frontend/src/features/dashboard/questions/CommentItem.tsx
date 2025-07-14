import { useState, useRef, useEffect } from 'react';
import { FaRegThumbsUp, FaRegCommentDots } from 'react-icons/fa';
import { formatDateTime } from '../../../utils/format';
import { Comment, UserActionType } from '../../../utils/types';
import {
 createUserCommentAction,
 deleteUserCommentAction,
 updateComment,
 deleteComment,
 createReply
} from '../../../utils/store';
import ThreeDotsMenu from '../../../components/ui/ThreeDotsMenu';


interface CommentItemProps {
 comment: Comment;
 onCommentDelete?: () => void;
 openMenuId: string | null;
 setOpenMenuId: (id: string | null) => void;
 questionId: number; // NEW: for creating replies
 level?: number; // NEW: 0 = top level, 1 = first reply, 2 = second reply
 onReplyAdded?: () => void;
}


function CommentItem({
 comment,
 onCommentDelete,
 openMenuId,
 setOpenMenuId,
 questionId,
 level = 0,
 onReplyAdded,
}: CommentItemProps) {
 const userId = Number(localStorage.getItem('userId'));
 const menuRef = useRef<HTMLDivElement>(null);


 const [liked, setLiked] = useState(!!comment.hasLiked);
 const [likeCount, setLikeCount] = useState(
   typeof comment.likeCount === 'number' ? comment.likeCount : 0
 );
 const [editMode, setEditMode] = useState(false);
 const [editForm, setEditForm] = useState({ content: comment.content });
 const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);


 const [isReplying, setIsReplying] = useState(false);
 const [replyContent, setReplyContent] = useState('');
 const [showReplies, setShowReplies] = useState(false);
 const [replies, setReplies] = useState<Comment[]>(comment.replies || []);
 const isAuthor = comment.user.id === userId;
 const canReply = !isAuthor && level < 2; // Can't reply to own comment, max 2 levels
 const replyCount = replies.length;


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
   } catch (err) {
     alert('Failed to update comment.');
   }
 };


 const handleCommentDelete = async () => {
   if (!comment) return;
   try {
     await deleteComment({ id: comment.id });
     if (onCommentDelete) onCommentDelete();
     setOpenMenuId(null);
   } catch (err) {
     alert('Failed to delete comment.');
     setOpenMenuId(null);
   }
 };


 const handleCommentLike = async () => {
   const prevLiked = liked;
   setLiked(!prevLiked);
   setLikeCount((prev) => prev + (prevLiked ? -1 : 1));
   try {
     if (!prevLiked) {
       await createUserCommentAction({
         commentId: comment.id,
         actionType: UserActionType.Like,
       });
     } else {
       await deleteUserCommentAction({
         commentId: comment.id,
         actionType: UserActionType.Like,
       });
     }
   } catch (err) {
     setLiked(prevLiked);
     setLikeCount((prev) => prev + (prevLiked ? 1 : -1));
     alert('Failed to update like status.');
   }
 };


 const handleReply = async () => {
   if (!replyContent.trim()) return;
   //console.log("inside reply");
   //console.log('TOKEN:', localStorage.getItem('token'));


   /*console.log('DEBUG: Sending reply data:', {
     questionId: questionId,
     content: replyContent,
     parentId: comment.id,
     commentIdType: typeof comment.id,
     questionIdType: typeof questionId,
   });*/
   try {
     const result = await createReply({
       questionId: questionId,
       content: replyContent,
       parentId: comment.id,
     });
   


     setReplyContent('');
     setIsReplying(false);
     setShowReplies(true); // Show replies after adding
     if (onReplyAdded) onReplyAdded(); // Refresh parent
   } catch (err) {
     alert('Failed to add reply.');
   }
 };


 const handleStartReply = () => {
   setIsReplying(true);
   setOpenMenuId(null);
 };


 const handleCancelReply = () => {
   setIsReplying(false);
   setReplyContent('');
 };


 const handleReportComment = () => {
   setOpenMenuId(null);
   alert('Reported!');
 };


 const getIndentationClass = () => {
   switch (level) {
     case 0:
       return 'ml-0'; // Top level
     case 1:
       return 'ml-6 border-l-2 border-blue-200 pl-4'; // First reply
     case 2:
       return 'ml-12 border-l-2 border-green-200 pl-4'; // Second reply
     default:
       return 'ml-0';
   }
 };


 const getBackgroundClass = () => {
   switch (level) {
     case 0:
       return 'bg-gray-100';
     case 1:
       return 'bg-blue-50';
     case 2:
       return 'bg-green-50 border border-green-200';
     default:
       return 'bg-gray-100';
   }
 };


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


 return (
   <div className={`${getIndentationClass()}`}>
     <div
       className={`w-full ${getBackgroundClass()} rounded-lg px-4 py-3 mb-3 shadow-sm`}
     >
       <div>
         <div className="flex items-start justify-between">
           {/* Username and Date */}
           <div>
             <span className="font-semibold text-[#004466]">
               {comment.user.username}
             </span>
             {/*level > 0 && (
               <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                 Level {level} Reply
               </span>
             )*/}
             <div className="text-xs text-gray-500 mt-1">
               {formatDateTime(comment.createdAt)}
             </div>
           </div>


           {/* Menu */}
           <div className="relative" ref={menuRef}>
             <ThreeDotsMenu
               menuRef={menuRef}
               menuId={`comment-menu-${comment.id}`}
               openMenuId={openMenuId}
               setOpenMenuId={setOpenMenuId}
               handleReport={handleReportComment}
               handleEdit={handleCommentEdit}
               handleDelete={() => setShowDeleteConfirmation(true)}
               handleReply={canReply ? handleStartReply : undefined} // Add reply option
               userId={userId}
               comment={comment}
             />
           </div>
         </div>


         {/* Content */}
         {editMode ? (
           <div className="mt-2">
             <textarea
               className="w-full p-2 border rounded mb-2"
               value={editForm.content}
               onChange={(e) => setEditForm({ content: e.target.value })}
               rows={2}
             />
             <div className="flex gap-2 justify-end">
               <button
                 className="px-3 py-1 bg-gray-200 rounded"
                 onClick={handleCancelCommentEdit}
               >
                 Cancel
               </button>
               <button
                 className="px-3 py-1 bg-blue-500 text-white rounded"
                 onClick={handleSubmitCommentEdit}
               >
                 Save
               </button>
             </div>
           </div>
         ) : (
           <div className="mt-2 text-sm text-[#616161]">{comment.content}</div>
         )}


         {/* NEW: Reply Input */}
         {isReplying && (
           <div className="mt-3 bg-white p-3 rounded border-2 border-blue-200">
             <textarea
               value={replyContent}
               onChange={(e) => setReplyContent(e.target.value)}
               placeholder={`Reply to ${comment.user.username}...`}
               className="w-full border p-2 rounded text-sm focus:outline-none focus:border-blue-400"
               rows={2}
             />
             <div className="flex justify-end space-x-2 mt-2">
               <button
                 className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                 onClick={handleCancelReply}
               >
                 Cancel
               </button>
               <button
                 className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
                 onClick={handleReply}
               >
                 Reply
               </button>
             </div>
           </div>
         )}


         {/* Action buttons */}
         <div className="flex items-center justify-between gap-6 mt-3">
           <div className="flex items-center gap-4">
             {/*  Reply button */}
             {canReply && (
               <button
                 className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer select-none"
                 onClick={handleStartReply}
               >
                 Reply
               </button>
             )}


             {/*  Show/Hide replies for top-level comments */}
             {level === 0 && replyCount > 0 && (
               <button
                 className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer select-none"
                 onClick={() => setShowReplies(!showReplies)}
               >
                 {showReplies ? 'Hide' : 'Show'} {replyCount}{' '}
                 {replyCount === 1 ? 'Reply' : 'Replies'}
               </button>
             )}
           </div>


           <div className="flex items-center gap-6">
             <div
               className={`flex items-center text-sm cursor-pointer select-none ${
                 liked ? 'text-blue-600' : 'text-gray-600'
               }`}
               onClick={handleCommentLike}
             >
               <FaRegThumbsUp className="mr-1" />
               {typeof likeCount === 'number' && !isNaN(likeCount)
                 ? likeCount
                 : 0}{' '}
               Like
             </div>
             <div className="flex items-center text-gray-600 text-sm">
               <FaRegCommentDots className="mr-1" />
               {replyCount} Replies
             </div>
           </div>
         </div>
       </div>


       {/* Delete Confirmation Modal */}
       {showDeleteConfirmation && (
         <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
           <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
             <h2 className="text-lg font-semibold mb-4">
               Are you sure you want to delete this comment?
             </h2>
             <div className="flex justify-end space-x-2">
               <button
                 onClick={() => setShowDeleteConfirmation(false)}
                 className="px-3 py-1 bg-gray-200 rounded"
               >
                 Cancel
               </button>
               <button
                 onClick={handleCommentDelete}
                 className="px-3 py-1 bg-red-500 text-white rounded"
               >
                 Delete
               </button>
             </div>
           </div>
         </div>
       )}
     </div>


     {/*  Nested Replies */}
     {level === 0 && showReplies && replies.length > 0 && (
       <div className="space-y-2">
         {replies.map((reply) => (
           <div key={reply.id}>
             <CommentItem
               comment={reply}
               openMenuId={openMenuId}
               setOpenMenuId={setOpenMenuId}
               onCommentDelete={onReplyAdded}
               questionId={questionId}
               level={1}
               onReplyAdded={onReplyAdded}
             />


             {/* Second Level Replies */}
             {reply.replies && reply.replies.length > 0 && (
               <div className="space-y-2">
                 {reply.replies.map((nestedReply) => (
                   <CommentItem
                     key={nestedReply.id}
                     comment={nestedReply}
                     openMenuId={openMenuId}
                     setOpenMenuId={setOpenMenuId}
                     onCommentDelete={onReplyAdded}
                     questionId={questionId}
                     level={2}
                   />
                 ))}
               </div>
             )}
           </div>
         ))}
       </div>
     )}
   </div>
 );
}


export default CommentItem;



