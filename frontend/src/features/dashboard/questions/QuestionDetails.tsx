import { useState, useEffect, useRef } from 'react';
import {
 FaFileAlt,
 FaRegThumbsUp,
 FaRegCommentDots,
 FaThumbsUp,
} from 'react-icons/fa';
import { formatDateTime } from '../../../utils/format';
import {
 Attachment,
 Interest,
 QuestionDetail,
 UserActionType,
} from '../../../utils/types';
import {
 getQuestion,
 createUserQuestionAction,
 deleteUserQuestionAction,
 createInterest,
 deleteInterest,
 updateQuestion,
 deleteQuestion
 //getCommentsByQuestionId
} from '../../../utils/store';
import ThreeDotsMenu from '../../../components/ui/ThreeDotsMenu';
import CommentItem from './CommentItem';
import CommentCreate from './CommentCreate';


interface QuestionDetailsProps {
 questionId: number;
 onQuestionUpdate?: (updatedQuestion: {
   id: number;
   title: string;
   description: string;
 }) => void;
 onQuestionDelete?: (deletedId: number) => void;
 onQuestionLike: (
   questionId: number,
   hasLiked: boolean,
   likeCount: number
 ) => void;
 interests: Interest[];
 setInterests: (interests: Interest[]) => void;
 onInterestsUpdate: () => void;
 onCommentCreate: (questionId: number) => void;
 onClose: () => void;
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
 onClose,
}: QuestionDetailsProps) {
 const userId = Number(localStorage.getItem('userId'));
 const modalRef = useRef<HTMLDivElement>(null);
 const menuRef = useRef<HTMLDivElement>(null);


 const [question, setQuestion] = useState<QuestionDetail | null>(null);
 const [attachment, setAttachment] = useState<File | null>(null);
 const [openMenuId, setOpenMenuId] = useState<string | null>(null);
 const [editMode, setEditMode] = useState(false);
 const [editForm, setEditForm] = useState({ title: '', description: '' });
 const [showAllReplies, setShowAllReplies] = useState(false);
 const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

 const currentInterest = interests.find((i) => i.question_id === questionId);
 const isInterested = !!currentInterest;
 const interestId = currentInterest?.id;


 function attachmentToFile(attachment: Attachment): File | null {
   if (!attachment?.data) return null;
   const base64 = attachment.data.startsWith('data:')
     ? attachment.data.split(',')[1]
     : attachment.data;
   const byteString = atob(base64);
   const ab = new ArrayBuffer(byteString.length);
   const ia = new Uint8Array(ab);
   for (let i = 0; i < byteString.length; i++) {
     ia[i] = byteString.charCodeAt(i);
   }
   const file = new File([ab], attachment.fileName, {
     type: attachment.mimeType,
   });
   return file;
 }


 const buildThreadedComments = (flatComments: any[]): any[] => {
  const commentMap = new Map();
  const topLevel: any[] = [];

  flatComments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  flatComments.forEach((comment) => {
    const commentWithReplies = commentMap.get(comment.id);

    
    if (comment.parentId === null || comment.parentId === undefined) {
      topLevel.push(commentWithReplies);
    } else {
      const parent = commentMap.get(comment.parentId); 
      if (parent) {
        parent.replies.push(commentWithReplies);
      }
    }
  });

  return topLevel;
};
 const fetchQuestion = async () => {
   try {
     const res = await getQuestion({ id: questionId });
        

     if (res.comments && res.comments.length > 0) {
       const threadedComments = buildThreadedComments(res.comments);
            // console.log('THREADED COMMENTS:', threadedComments);


       res.comments = threadedComments;
     }
     setQuestion(res);
     setAttachment(res.attachment ? attachmentToFile(res.attachment) : null);
     //console.log('Fetched question:', res);
   } catch (err) {
     console.error(err);
     setQuestion(null);
     setAttachment(null);
   }
 };


 const handleQuestionEdit = () => {
   if (editMode) {
     setEditMode(false);
   } else if (question) {
     setEditMode(true);
     setEditForm({ title: question.title, description: question.description });
   }
 };


 const handleCancelQuestionEdit = () => {
   setEditMode(false);
   setEditForm({ title: '', description: '' });
   setAttachment(
     question?.attachment ? attachmentToFile(question.attachment) : null
   );
 };


 const handleSubmitQuestionEdit = async () => {
   if (!question) return;
   try {
     if (attachment && attachment.size > 10 * 1024 * 1024) {
       alert('Attachment size exceeds 10MB limit.');
       return;
     }
     const updateData: {
       title: string;
       description: string;
       attachment?: File | null;
     } = {
       title: editForm.title,
       description: editForm.description,
     };
     if (attachment) {
       updateData.attachment = attachment;
     }
     await updateQuestion({ id: question.id, ...updateData });
     setEditMode(false);
     setAttachment(null);
     fetchQuestion();
     if (onQuestionUpdate)
       onQuestionUpdate({
         id: question.id,
         title: editForm.title,
         description: editForm.description,
       });
   } catch (err) {
     alert('Failed to update question.');
   }
 };


 const handleQuestionDelete = async () => {
   if (!question) return;
   try {
     await deleteQuestion({ id: question.id });
     if (onQuestionDelete) onQuestionDelete(question.id);
     onClose();
   } catch (err) {
     alert('Failed to delete question.');
   }
 };


 const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const file = e.target.files?.[0] || null;
   setAttachment(file);
 };


 const handleQuestionLike = async (e: React.MouseEvent) => {
   e.stopPropagation();
   if (!question) return;
   const newLiked = !question.hasLiked;
   const newLikes = question.likeCount + (question.hasLiked ? -1 : 1);
   setQuestion({
     ...question,
     hasLiked: newLiked,
     likeCount: newLikes,
   });
   onQuestionLike(question.id, newLiked, newLikes);
   try {
     if (!question.hasLiked) {
       await createUserQuestionAction({
         questionId: question.id,
         actionType: UserActionType.Like,
       });
     } else {
       await deleteUserQuestionAction({
         questionId: question.id,
         actionType: UserActionType.Like,
       });
     }
   } catch (error) {
     alert('Failed to update like status.');
   }
 };


 const handleQuestionInterest = async (e?: React.MouseEvent) => {
   if (e) e.stopPropagation();
   if (!isInterested) {
     try {
       const newInterest: Interest = await createInterest({
         questionId: questionId,
       });
       setInterests([...interests, newInterest]);
     } catch (error) {
       alert('Failed to bookmark question.');
     }
   } else {
     if (interestId == null) return;
     try {
       await deleteInterest({ id: interestId });
       setInterests(interests.filter((i) => i.id !== interestId));
     } catch (error) {
       alert('Failed to remove bookmark.');
     }
   }
   onInterestsUpdate();
 };


 const handleCommentCreate = (questionId: number) => {
   fetchQuestion();
   setRefreshKey(prev => prev + 1);
   onCommentCreate(questionId);
 };

 const handleReplyAdded = () => {
  fetchQuestion();
  setRefreshKey(prev => prev + 1);
 };


 const handleReportQuestion = () => {
   console.log('Report clicked');
 };


 // fetch question on mount
 useEffect(() => {
   if (typeof questionId !== 'number' || isNaN(questionId)) {
     console.warn('QuestionDetails: Invalid questionId', questionId);
     return;
   }
   fetchQuestion();
 }, [questionId]);


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
   document.addEventListener('mousedown', handleDocClick);
   return () => {
     document.removeEventListener('mousedown', handleDocClick);
   };
 }, [openMenuId, setOpenMenuId, menuRef]);


 return (
   <div className="fixed inset-0 z-50 flex items-center justify-center">
     <div
       className="fixed inset-0 bg-black bg-opacity-30 cursor-auto"
       style={{ zIndex: 49 }}
       onClick={(e) => {
         e.stopPropagation();
         onClose();
       }}
     ></div>
     <div
       ref={modalRef}
       className="relative z-50 p-6 flex flex-col items-center space-y-4 overflow-y-auto max-h-[90vh] cursor-auto"
       style={{
         width: '676px',
         backgroundColor: '#FFFFFF',
         borderRadius: '7px',
         boxShadow: '0px 6px 18px 0px #442756',
       }}
     >
       {/* Question Header */}
       {question && (
         <div className="absolute top-4 right-4">
           <ThreeDotsMenu
             menuRef={menuRef}
             menuId={`question-${question.id}`}
             openMenuId={openMenuId}
             setOpenMenuId={setOpenMenuId}
             handleInterest={handleQuestionInterest}
             handleReport={handleReportQuestion}
             handleEdit={handleQuestionEdit}
             handleDelete={() => setShowDeleteConfirmation(true)}
             userId={userId}
             question={question}
             isInterested={isInterested}
           />
         </div>
       )}


       {/* Question Content */}
       {question && (
         <>
           <div className="w-full text-left bg-[#f6f6f6] rounded-lg p-6">
             <h3 className="text-lg font-semibold text-[#004466] mb-2">
               {question.user.username}
             </h3>
             <p className="text-xs text-gray-500 mb-4">
               {formatDateTime(question.createdAt)}
             </p>


             {/* Question Title */}
             {editMode ? (
               <input
                 className="w-full mb-2 p-2 border rounded"
                 value={editForm.title}
                 onChange={(e) =>
                   setEditForm({ ...editForm, title: e.target.value })
                 }
                 placeholder="Title"
               />
             ) : (
               <h3 className="text-lg font-semibold text-[#004466] mb-2">
                 {question.title}
               </h3>
             )}


             {/* Question Description */}
             {editMode ? (
               <textarea
                 className="w-full mb-2 p-2 border rounded"
                 value={editForm.description}
                 onChange={(e) =>
                   setEditForm({ ...editForm, description: e.target.value })
                 }
                 placeholder="Description"
                 rows={4}
               />
             ) : (
               <p className="text-sm text-[#616161] mb-2 inline">
                 {question.description}
               </p>
             )}


             {/* Question Attachment */}
             {editMode ? (
               <div className="mb-4 mt-3 flex items-center justify-between gap-3">
                 {attachment ? (
                   <>
                     <FaFileAlt className="mr-2" />
                     <span className="text-sm text-gray-600">
                       {attachment.name} (
                       {(attachment.size / 1024 / 1024).toFixed(2)} MB)
                     </span>
                     <button
                       type="button"
                       className="ml-auto px-3 py-1 bg-gray-200 text-red-500 rounded hover:bg-gray-300 transition"
                       onClick={(e) => {
                         e.stopPropagation();
                         setAttachment(null);
                       }}
                       style={{ cursor: 'pointer' }}
                     >
                       Remove
                     </button>
                   </>
                 ) : (
                   <div className="flex justify-end w-full">
                     <label
                       htmlFor="attachment"
                       style={{
                         paddingLeft: '12px',
                         paddingRight: '12px',
                         paddingTop: '4px',
                         paddingBottom: '4px',
                         backgroundColor: '#3B82F6',
                         color: '#FFFFFF',
                         borderRadius: '0.375rem',
                         cursor: 'pointer',
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
               attachment && (
                 <div className="flex items-center text-xs text-gray-600 bg-gray-100 rounded px-2 mb-4 mt-3 cursor-pointer hover:bg-gray-200 transition w-fit">
                   <FaFileAlt className="mr-2" />
                   <div
                     className="px-2 py-1"
                     onClick={() => {
                       const url = URL.createObjectURL(attachment);
                       window.open(url, '_blank');
                     }}
                   >
                     {attachment.name}
                   </div>
                 </div>
               )
             )}


             {/* Question Edit Buttons */}
             {editMode && (
               <div className="flex justify-end gap-2 mt-2">
                 <button
                   className="px-3 py-1 bg-gray-200 rounded"
                   onClick={handleCancelQuestionEdit}
                 >
                   Cancel
                 </button>
                 <button
                   className="px-3 py-1 bg-blue-500 text-white rounded"
                   onClick={handleSubmitQuestionEdit}
                 >
                   Save
                 </button>
               </div>
             )}


             {/* Question Like/Comment Count */}
             <div className="flex items-center justify-between w-full mt-4">
               <div>
                 {question.comments &&
                   question.comments.length > 2 &&
                   !showAllReplies && (
                     <button
                       className="text-sm font-medium border px-3 py-1 rounded bg-white hover:bg-gray-50 transition"
                       onClick={() => setShowAllReplies(true)}
                     >
                       Show all replies
                     </button>
                   )}
               </div>
               <div className="flex items-center space-x-4">
                 <div
                   className={`flex items-center text-sm select-none ${
                     question.hasLiked ? 'text-blue-600' : 'text-gray-600'
                   }`}
                   onClick={handleQuestionLike}
                   style={{ cursor: 'pointer' }}
                 >
                   {question.hasLiked ? (
                     <FaThumbsUp className="mr-1" />
                   ) : (
                     <FaRegThumbsUp className="mr-1" />
                   )}
                   {question.likeCount} Likes
                 </div>
                 <div className="flex items-center text-gray-600 text-sm">
                   <FaRegCommentDots className="mr-1" />{' '}
                   {question.commentCount} Comments
                 </div>
               </div>
             </div>
           </div>


           {/* Question Comments */}
           {question.comments && question.comments.length > 0 && (
             <div className="w-full mt-6">
               {(showAllReplies
                 ? question.comments
                 : question.comments.slice(0, 2)
               ).map((comment) => (
                 <CommentItem
                   key={`${comment.id}-${refreshKey}`} 
                   comment={comment}
                   openMenuId={openMenuId}
                   setOpenMenuId={setOpenMenuId}
                   onCommentDelete={handleReplyAdded}
                   questionId={questionId}
                   onReplyAdded={handleReplyAdded} 
                 />
               ))}
             </div>
           )}
         </>
       )}


       {/* Create Comment */}
       <div className="w-full flex justify-center mt-6">
         <CommentCreate
           questionId={questionId}
           onCommentCreate={handleCommentCreate}
         />
       </div>
     </div>


     {/* Delete Confirmation Modal */}
     {showDeleteConfirmation && (
       <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
         <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
           <h2 className="text-lg font-semibold mb-4">
             Are you sure you want to delete this question?
           </h2>
           <div className="flex justify-end space-x-2">
             <button
               onClick={() => setShowDeleteConfirmation(false)}
               className="px-3 py-1 bg-gray-200 rounded"
             >
               Cancel
             </button>
             <button
               onClick={handleQuestionDelete}
               className="px-3 py-1 bg-red-500 text-white rounded"
             >
               Delete
             </button>
           </div>
         </div>
       </div>
     )}
   </div>
 );
}


export default QuestionDetails;



