import axiosInstance from './api';
import {
  Category,
  QuestionsResponse,
  QuestionDetail,
  UserActionType,
  Interest,
  SearchResponse,
  User,
  KcRole,
  RoleMapping,
  AdminUser,
  Notification,
  FeedbackEntry,
  LeaderboardEntry,
  UserStats,
  AdminQuestion,
  DeletedQuestion,
  Report,
  AuditLogEntry,
  AdminInsights,
  EditHistoryEntry,
} from './types';

// auth endpoints
export async function googleAuth(params: {
  credential: string;
}): Promise<{ token: string; needsProfile: boolean }> {
  const res = await axiosInstance.post<{ token: string; needsProfile: boolean }>(
    '/auth/google',
    params
  );
  return res.data;
}

export async function completeProfile(params: { username: string }): Promise<string> {
  const res = await axiosInstance.patch<string>('/users/me', params);
  return res.data;
}

// admin endpoints
export async function getRoleMappings(): Promise<RoleMapping[]> {
  const res = await axiosInstance.get<RoleMapping[]>('/admin/role-mappings');
  return res.data;
}

export async function createRoleMapping(params: { tag: string; role: KcRole }): Promise<RoleMapping> {
  const res = await axiosInstance.post<RoleMapping>('/admin/role-mappings', params);
  return res.data;
}

export async function deleteRoleMapping(id: number): Promise<void> {
  await axiosInstance.delete(`/admin/role-mappings/${id}`);
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const res = await axiosInstance.get<AdminUser[]>('/admin/users');
  return res.data;
}

export async function grantAdmin(userId: number): Promise<void> {
  await axiosInstance.post(`/admin/users/${userId}/admin`);
}

export async function revokeAdmin(userId: number): Promise<void> {
  await axiosInstance.delete(`/admin/users/${userId}/admin`);
}

export async function getAllFeedback(): Promise<FeedbackEntry[]> {
  const res = await axiosInstance.get<FeedbackEntry[]>('/admin/feedback');
  return res.data;
}

export async function setFeedbackRead(id: number, read: boolean): Promise<{ id: number; read: boolean }> {
  const res = await axiosInstance.patch<{ id: number; read: boolean }>(`/admin/feedback/${id}/read`, { read });
  return res.data;
}

export async function deleteFeedback(id: number): Promise<void> {
  await axiosInstance.delete(`/admin/feedback/${id}`);
}

// feedback endpoint
export async function submitFeedback(message: string): Promise<{ id: number }> {
  const res = await axiosInstance.post<{ id: number }>('/feedback', { message });
  return res.data;
}

// category endpoints
export async function getAllCategories(): Promise<
  { id: number; name: string }[]
> {
  const res = await axiosInstance.get<Category[]>('/categories');
  return res.data;
}

// question endpoints
export async function getRecentQuestions(params?: {
  count?: number;
  offset?: number;
  unanswered?: boolean;
}): Promise<QuestionsResponse> {
  const res = await axiosInstance.get<QuestionsResponse>('/questions', {
    params,
  });
  return res.data;
}

// duplicate-question nudge while composing
export async function getSimilarQuestions(title: string): Promise<{ id: number; title: string; score: number }[]> {
  const res = await axiosInstance.get('/questions/similar', { params: { title } });
  return res.data;
}

export async function getPopularQuestions(params?: {
  count?: number;
  offset?: number;
}): Promise<QuestionsResponse> {
  const res = await axiosInstance.get<QuestionsResponse>('/questions/popular', {
    params,
  });
  return res.data;
}

export async function getQuestion(params: {
  id: number;
}): Promise<QuestionDetail> {
  const res = await axiosInstance.get<QuestionDetail>(
    `/questions/${params.id}`
  );
  return res.data;
}

export async function createQuestion(params: {
  title: string;
  description: string;
  attachment?: File | null;
  tags?: string[];
  categoryIds?: string[];
  mentionedUserIds?: number[];
}): Promise<number> {
  const formData = new FormData();
  formData.append('title', params.title);
  formData.append('description', params.description);
  if (params.attachment) formData.append('attachment', params.attachment);
  if (params.tags) formData.append('tags', JSON.stringify(params.tags));
  if (params.categoryIds) formData.append('categoryIds', JSON.stringify(params.categoryIds));
  if (params.mentionedUserIds && params.mentionedUserIds.length > 0)
    formData.append('mentionedUserIds', JSON.stringify(params.mentionedUserIds));
  const res = await axiosInstance.post<number>('/questions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function updateQuestion(params: {
  id: number;
  title?: string;
  description?: string;
  attachment?: File | null;
  removeAttachment?: boolean;
  tags?: string[];
  categoryIds?: string[];
}): Promise<number> {
  const formData = new FormData();
  if (params.title !== undefined) formData.append('title', params.title);
  if (params.description !== undefined)
    formData.append('description', params.description);
  if (params.attachment) formData.append('attachment', params.attachment);
  if (params.removeAttachment) formData.append('removeAttachment', 'true');
  if (params.tags) formData.append('tags', JSON.stringify(params.tags));
  if (params.categoryIds) formData.append('categoryIds', JSON.stringify(params.categoryIds));
  const res = await axiosInstance.put<number>(
    `/questions/${params.id}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return res.data;
}

// list every known tag a question can be restricted to
export async function getKnownTags(): Promise<string[]> {
  const res = await axiosInstance.get<string[]>('/questions/tags');
  return res.data;
}

export async function deleteQuestion(params: { id: number }): Promise<void> {
  await axiosInstance.delete(`/questions/${params.id}`);
}

export async function getQuestionEditHistory(id: number): Promise<EditHistoryEntry[]> {
  const res = await axiosInstance.get<EditHistoryEntry[]>(`/questions/${id}/history`);
  return res.data;
}

export async function getCommentEditHistory(id: number): Promise<EditHistoryEntry[]> {
  const res = await axiosInstance.get<EditHistoryEntry[]>(`/comments/${id}/history`);
  return res.data;
}

export async function muteQuestion(id: number): Promise<{ muted: boolean }> {
  const res = await axiosInstance.post(`/questions/${id}/mute`);
  return res.data;
}

export async function unmuteQuestion(id: number): Promise<{ muted: boolean }> {
  const res = await axiosInstance.delete(`/questions/${id}/mute`);
  return res.data;
}

// mark/unmark a comment as the accepted answer (pass commentId: null to clear)
export async function setAcceptedAnswer(params: {
  questionId: number;
  commentId: number | null;
}): Promise<{ solved: boolean; acceptedCommentId: number | null }> {
  const res = await axiosInstance.patch(`/questions/${params.questionId}/accept-answer`, {
    commentId: params.commentId,
  });
  return res.data;
}

// comment endpoints
export async function createComment(params: {
  questionId: number;
  content: string;
  parentId?: number | null;
  attachment?: File | null;
  mentionedUserIds?: number[];
  mentionedGroupTags?: string[];
}): Promise<number> {
  const formData = new FormData();
  formData.append('questionId', String(params.questionId));
  formData.append('content', params.content);
  if (params.parentId !== undefined && params.parentId !== null)
    formData.append('parentId', String(params.parentId));
  if (params.attachment) formData.append('attachment', params.attachment);
  if (params.mentionedUserIds && params.mentionedUserIds.length > 0)
    formData.append('mentionedUserIds', JSON.stringify(params.mentionedUserIds));
  if (params.mentionedGroupTags && params.mentionedGroupTags.length > 0)
    formData.append('mentionedGroupTags', JSON.stringify(params.mentionedGroupTags));
  const res = await axiosInstance.post<number>('/comments', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function createReply(params: {
  questionId: number;
  content: string;
  parentId: number;
  mentionedUserIds?: number[];
  mentionedGroupTags?: string[];
}): Promise<number> {
  const res = await axiosInstance.post<number>('/comments', {
    questionId: params.questionId,
    content: params.content,
    parentId: params.parentId,
    mentionedUserIds: params.mentionedUserIds,
    mentionedGroupTags: params.mentionedGroupTags,
  });
  return res.data;
}

export interface MentionUser {
  id: number;
  displayName: string;
  email?: string;
  pictureUrl?: string | null;
  fullRoleTag?: string | null;
}

export async function searchMentionUsers(query: string): Promise<MentionUser[]> {
  if (!query.trim()) return [];
  const res = await axiosInstance.get<MentionUser[]>('/users/search', { params: { q: query } });
  return res.data;
}

export async function getCommentsByQuestionId(params: {
  questionId: number;
  count?: number;
  offset?: number;
}): Promise<{ comments: Comment[]; total: number; offset: number }> {
  const res = await axiosInstance.get('/comments', {
    params: {
      questionId: params.questionId,
      count: params.count || 100,
      offset: params.offset || 0,
    },
  });
  return res.data;
}

export async function updateComment(params: {
  id: number;
  content: string;
  attachment?: File | null;
}): Promise<number> {
  const formData = new FormData();
  formData.append('content', params.content);
  if (params.attachment) formData.append('attachment', params.attachment);
  const res = await axiosInstance.put<number>(
    `/comments/${params.id}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return res.data;
}

export async function deleteComment(params: { id: number }): Promise<number> {
  const res = await axiosInstance.delete<number>(`/comments/${params.id}`);
  return res.data;
}

// user actions endpoints
export async function createUserQuestionAction(params: {
  questionId: number;
  actionType: UserActionType;
}): Promise<number> {
  const res = await axiosInstance.post<number>(
    '/question-actions/action',
    params
  );
  return res.data;
}

export async function deleteUserQuestionAction(params: {
  questionId: number;
  actionType: UserActionType;
}): Promise<number> {
  const res = await axiosInstance.delete<number>('/question-actions/action', {
    data: params,
  });
  return res.data;
}

export async function createUserCommentAction(params: {
  commentId: number;
  actionType: UserActionType;
}): Promise<number> {
  const res = await axiosInstance.post<number>(
    '/comment-actions/action',
    params
  );
  return res.data;
}

export async function deleteUserCommentAction(params: {
  commentId: number;
  actionType: UserActionType;
}): Promise<number> {
  const res = await axiosInstance.delete<number>('/comment-actions/action', {
    data: params,
  });
  return res.data;
}

// interests endpoints
export async function getUserInterests(): Promise<Interest[]> {
  const res = await axiosInstance.get<Interest[]>(`/interests/`);
  return res.data;
}

export async function createInterest(params: {
  questionId: number;
}): Promise<Interest> {
  const res = await axiosInstance.post<Interest>('/interests', params);
  return res.data;
}

export async function deleteInterest(params: { id: number }): Promise<number> {
  const res = await axiosInstance.delete<number>(`/interests/${params.id}`);
  return res.data;
}

// search endpoints
export async function searchQuestions(params: {
  query: string;
  count: number;
  offset: number;
  categoriesIds: number[];
  hasNone: boolean;
  tag?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<SearchResponse> {
  return axiosInstance
    .post<SearchResponse>('/search', params)
    .then((res) => res.data);
}

// notification endpoints
export async function getNotifications(): Promise<Notification[]> {
  const res = await axiosInstance.get<Notification[]>('/notifications');
  return res.data;
}

export async function createAnnouncement(params: {
  message: string;
  targetUrl?: string;
}): Promise<void> {
  await axiosInstance.post('/notifications/announcement', params);
}

export async function markNotificationRead(params: {
  id: number;
}): Promise<void> {
  await axiosInstance.patch(`/notifications/${params.id}/mark-read`);
}

export async function deleteNotification(id: number): Promise<void> {
  await axiosInstance.delete(`/notifications/${id}`);
}

export async function clearAllNotifications(): Promise<void> {
  await axiosInstance.delete('/notifications');
}

export const getMe = async (): Promise<User> => {
  const response = await axiosInstance.get<User>("/users/me");
  return response.data;
};

// leaderboard + personal stats
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const res = await axiosInstance.get<LeaderboardEntry[]>('/users/leaderboard');
  return res.data;
}

export async function getMyStats(): Promise<UserStats> {
  const res = await axiosInstance.get<UserStats>('/users/me/stats');
  return res.data;
}

// admin: group membership override
export async function setUserTag(userId: number, tag: string | null): Promise<void> {
  await axiosInstance.patch(`/admin/users/${userId}/tag`, { tag });
}

// admin: posts list + pin + bulk actions + soft-delete/restore
export async function getAdminQuestions(): Promise<AdminQuestion[]> {
  const res = await axiosInstance.get<AdminQuestion[]>('/admin/questions');
  return res.data;
}

export async function toggleQuestionPin(id: number): Promise<{ pinned: boolean }> {
  const res = await axiosInstance.patch(`/admin/questions/${id}/pin`);
  return res.data;
}

export async function bulkUpdateQuestionStatus(ids: number[], status: string): Promise<void> {
  await axiosInstance.patch('/admin/questions/bulk-status', { ids, status });
}

export async function bulkAddQuestionTags(ids: number[], tags: string[]): Promise<void> {
  await axiosInstance.patch('/admin/questions/bulk-tag', { ids, tags });
}

export async function getDeletedQuestions(): Promise<DeletedQuestion[]> {
  const res = await axiosInstance.get<DeletedQuestion[]>('/admin/questions/deleted');
  return res.data;
}

export async function restoreQuestion(id: number): Promise<void> {
  await axiosInstance.post(`/admin/questions/${id}/restore`);
}

// admin: reports queue
export async function getReports(): Promise<Report[]> {
  const res = await axiosInstance.get<Report[]>('/admin/reports');
  return res.data;
}

export async function dismissReport(type: "question" | "comment", id: number): Promise<void> {
  await axiosInstance.delete(`/admin/reports/${type}/${id}`);
}

// admin: audit log + insights
export async function getAuditLog(): Promise<AuditLogEntry[]> {
  const res = await axiosInstance.get<AuditLogEntry[]>('/admin/audit-log');
  return res.data;
}

export async function getAdminInsights(): Promise<AdminInsights> {
  const res = await axiosInstance.get<AdminInsights>('/admin/insights');
  return res.data;
}
