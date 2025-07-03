import axiosInstance from './api';
import {
  Category,
  QuestionsResponse,
  QuestionDetail,
  UserActionType,
  Interest,
  SearchResponse
} from './types';

// auth endpoints
export async function register(params: { username: string; email: string; password: string }): Promise<string> {
  const res = await axiosInstance.post<string>('/auth/register', params);
  return res.data;
}

export async function login(params: { email: string; password: string }): Promise<string> {
  const res = await axiosInstance.post<string>('/auth/login', params);
  return res.data;
}

// category endpoints
export async function getAllCategories(): Promise<{ id: number; name: string }[]> {
  const res = await axiosInstance.get<Category[]>("/categories");
  return res.data;
}

// question endpoints
export async function getRecentQuestions(params?: { count?: number; offset?: number }): Promise<QuestionsResponse> {
  const res = await axiosInstance.get<QuestionsResponse>('/questions', { params });
  return res.data;
}

export async function getPopularQuestions(params?: { count?: number; offset?: number }): Promise<QuestionsResponse> {
  const res = await axiosInstance.get<QuestionsResponse>('/questions/popular', { params });
  return res.data;
}

export async function getQuestion(params: { id: number }): Promise<QuestionDetail> {
  const res = await axiosInstance.get<QuestionDetail>(`/questions/${params.id}`);
  return res.data;
}

export async function createQuestion(params: { title: string; description: string; attachment?: File | null }): Promise<number> {
  const formData = new FormData();
  formData.append('title', params.title);
  formData.append('description', params.description);
  if (params.attachment) formData.append('attachment', params.attachment);
  const res = await axiosInstance.post<number>('/questions', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
}

export async function updateQuestion(params: { id: number; title?: string; description?: string; attachment?: File | null }): Promise<number> {
  const formData = new FormData();
  if (params.title !== undefined) formData.append('title', params.title);
  if (params.description !== undefined) formData.append('description', params.description);
  if (params.attachment) formData.append('attachment', params.attachment);
  const res = await axiosInstance.put<number>(`/questions/${params.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
}

export async function deleteQuestion(params: { id: number }): Promise<void> {
  await axiosInstance.delete(`/questions/${params.id}`);
}

// comment endpoints
export async function createComment(params: { questionId: number; content: string; parentId?: number | null; attachment?: File | null; }): Promise<number> {
  const formData = new FormData();
  formData.append('questionId', String(params.questionId));
  formData.append('content', params.content);
  if (params.parentId !== undefined && params.parentId !== null) formData.append('parentId', String(params.parentId));
  if (params.attachment) formData.append('attachment', params.attachment);
  const res = await axiosInstance.post<number>('/comments', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
}

export async function updateComment(params: { id: number; content: string; attachment?: File | null; }): Promise<number> {
  const formData = new FormData();
  formData.append('content', params.content);
  if (params.attachment) formData.append('attachment', params.attachment);
  const res = await axiosInstance.put<number>(`/comments/${params.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
}

export async function deleteComment(params: { id: number }): Promise<number> {
  const res = await axiosInstance.delete<number>(`/comments/${params.id}`);
  return res.data;
}

// user actions endpoints
export async function createUserQuestionAction(params: { questionId: number; actionType: UserActionType }): Promise<number> {
  const res = await axiosInstance.post<number>('/question-actions/action', params);
  return res.data;
}

export async function deleteUserQuestionAction(params: { questionId: number; actionType: UserActionType }): Promise<number> {
  const res = await axiosInstance.delete<number>('/question-actions/action', { data: params });
  return res.data;
}

export async function createUserCommentAction(params: { commentId: number; actionType: UserActionType }): Promise<number> {
  const res = await axiosInstance.post<number>('/comment-actions/action', params);
  return res.data;
}

export async function deleteUserCommentAction(params: { commentId: number; actionType: UserActionType }): Promise<number> {
  const res = await axiosInstance.delete<number>('/comment-actions/action', { data: params });
  return res.data;
}

// interests endpoints
export async function getUserInterests(): Promise<Interest[]> {
  const res = await axiosInstance.get<Interest[]>(`/interests/`);
  return res.data;
}

export async function createInterest(params: { questionId: number }): Promise<number> {
  const res = await axiosInstance.post<number>('/interests', params);
  return res.data;
}

export async function deleteInterest(params: { id: number }): Promise<number> {
  const res = await axiosInstance.delete<number>(`/interests/${params.id}`);
  return res.data;
}

// search endpoints
export async function searchQuestions(params: { query: string; count: number; offset: number; categoriesIds: number[]; hasNone: boolean }): Promise<SearchResponse> {
  return axiosInstance.post<SearchResponse>("/search", params).then(res => res.data);
}

// notification endpoints
export async function getNotifications(): Promise<any[]> {
  const res = await axiosInstance.get<any[]>("/notifications");
  return res.data;
}

export async function createAnnouncement(params: { message: string; targetUrl?: string }): Promise<void> {
  await axiosInstance.post("/notifications/announcement", params);
}

export async function markNotificationRead(params: { id: number }): Promise<void> {
  await axiosInstance.patch(`/notifications/${params.id}/mark-read`);
}
