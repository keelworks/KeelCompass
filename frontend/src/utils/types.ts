export enum UserType {
  User = "user",
  Facilitator = "facilitator"
}

export enum QuestionStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected"
}

export enum UserActionType {
  Like = "like",
  Report = "report"
}

// response for auth routes
export interface User {
  id: number;
  role: UserType;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// response for category
export interface Category {
  id: number;
  name: string;
}

// response for get recent/popular questions
export interface QuestionsResponse {
  questions: QuestionListItem[];
  total: number;
  offset: number;
}

export interface QuestionListItem {
  id: number;
  user: { username: string };
  title: string;
  description: string;
  status: QuestionStatus;
  createdAt: string;
  isInterested: boolean;
  interestId: number | null;
  hasLiked: boolean;
  likeCount: number;
  commentCount: number;
  popularityScore?: number;
}

// response for get question details
export interface QuestionDetail extends Omit<QuestionListItem, 'user'> {
  user: QuestionListItem['user'] & { id: number };
  updatedAt?: string;
  attachment?: Attachment;
  comments?: Comment[];
}

export interface Attachment {
  id: number;
  fileName: string;
  mimeType: string;
  data?: string;
}

export interface Comment {
  id: number;
  user: { id: number; username: string };
  content: string;
  createdAt: string;
  updatedAt?: string;
  attachment?: Attachment | null;
  hasLiked: boolean;
  likeCount: number;
}

// response for get interests
export interface Interest {
  id: number;
  user_id: number;
  question_id: number;
  comment_id: number | null;
  created_at: string;
  updated_at: string;
  question?: {
    id: number;
    title: string;
    description: string;
  } | null;
  comment?: {
    id: number;
    content: string;
  } | null;
}
