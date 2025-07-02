import axiosInstance from './api';
import {
  Category,
  QuestionsResponse,
  QuestionDetail,
  UserActionType,
  Interest,
} from './types';

// auth endpoints
export async function register(data: { username: string; email: string; password: string }): Promise<string> {
  const res = await axiosInstance.post<string>('/auth/register', data);
  return res.data;
}

export async function login(data: { email: string; password: string }): Promise<string> {
  const res = await axiosInstance.post<string>('/auth/login', data);
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

export async function getQuestion(id: number): Promise<QuestionDetail> {
  const res = await axiosInstance.get<QuestionDetail>(`/questions/${id}`);
  return res.data;
}

export async function createQuestion(data: { title: string; description: string; attachment?: File | null }): Promise<number> {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  if (data.attachment) formData.append('attachment', data.attachment);
  const res = await axiosInstance.post<number>('/questions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function updateQuestion(id: number, data: { title?: string; description?: string; attachment?: File | null }): Promise<number> {
  const formData = new FormData();
  if (data.title !== undefined) formData.append('title', data.title);
  if (data.description !== undefined) formData.append('description', data.description);
  if (data.attachment) formData.append('attachment', data.attachment);
  const res = await axiosInstance.put<number>(`/questions/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function deleteQuestion(id: number): Promise<void> {
  await axiosInstance.delete(`/questions/${id}`);
}

// comment endpoints
export async function createComment(data: { questionId: number; content: string; parentId?: number | null; attachment?: File | null; }): Promise<number> {
  const formData = new FormData();
  formData.append('questionId', data.questionId.toString());
  formData.append('content', data.content);
  if (data.parentId) formData.append('parentId', data.parentId.toString());
  if (data.attachment) formData.append('attachment', data.attachment);
  const res = await axiosInstance.post<number>('/comments', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function updateComment(id: number, data: { content: string; attachment?: File | null; }): Promise<number> {
  const formData = new FormData();
  formData.append('content', data.content);
  if (data.attachment) formData.append('attachment', data.attachment);
  const res = await axiosInstance.put<number>(`/comments/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function deleteComment(id: number): Promise<number> {
  const res = await axiosInstance.delete<number>(`/comments/${id}`);
  return res.data;
}

// user actions (likes, reports, bookmarks)
export async function createUserQuestionAction(data: { questionId: number; actionType: UserActionType }): Promise<number> {
  const res = await axiosInstance.post<number>('/question-actions/action', data);
  return res.data;
}

export async function deleteUserQuestionAction(data: { questionId: number; actionType: UserActionType }): Promise<number> {
  const res = await axiosInstance.delete<number>('/question-actions/action', { data });
  return res.data;
}

export async function createUserCommentAction(data: { commentId: number; actionType: UserActionType }): Promise<number> {
  const res = await axiosInstance.post<number>('/comment-actions/action', data);
  return res.data;
}

export async function deleteUserCommentAction(data: { commentId: number; actionType: UserActionType }): Promise<number> {
  const res = await axiosInstance.delete<number>('/comment-actions/action', { data });
  return res.data;
}

// interests endpoints
export async function getUserInterests(userId: number): Promise<Interest[]> {
  const res = await axiosInstance.get<Interest[]>(`/interests/${userId}`);
  return res.data;
}

export async function createInterest(questionId: number): Promise<number> {
  const res = await axiosInstance.post<number>('/interests', { questionId });
  return res.data;
}

export async function deleteInterest(interestId: number): Promise<number> {
  const res = await axiosInstance.delete<number>(`/interests/${interestId}`);
  return res.data;
}

