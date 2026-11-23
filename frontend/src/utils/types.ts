export enum UserType {
  User = "user",
  Facilitator = "facilitator",
}

export enum QuestionStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
}

export enum UserActionType {
  Like = "like",
  Report = "report",
}

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  message: string;
  target_url: string | null;
  read: boolean;
  created_at: string;
}

export interface FeedbackEntry {
  id: number;
  message: string;
  read: boolean;
  createdAt: string;
  user: {
    id: number;
    username: string | null;
    email: string;
    displayName: string | null;
  };
}

// response for auth routes
export interface User {
  id: number;
  role: UserType;
  username: string | null;
  email: string;
  picture_url: string | null;
  raw_role_tag: string | null;
  full_role_tag: string | null;
  display_name: string | null;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export type KcRole = "admin" | "manager" | "staff" | "viewer";

export interface RoleMapping {
  id: number;
  tag: string;
  role: KcRole;
}

export interface AdminUser {
  id: number;
  username: string | null;
  email: string;
  raw_role_tag: string | null;
  manual_role_tag: string | null;
  reputation_points: number;
  roles: KcRole[];
  isManualAdmin: boolean;
}

// response for category
export interface Category {
  id: number;
  name: string;
}

// response for get recent/popular questions
export interface QuestionsResponse {
  questions: QuestionListItem[];
  count: number;
  offset: number;
}

export interface QuestionListItem {
  id: number;
  user: {
    username: string;
    email?: string;
    displayName?: string | null;
    pictureUrl?: string | null;
    fullRoleTag?: string | null;
  };
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
  categories?: Category[];
  tags?: string[];
  pinned?: boolean;
  solved?: boolean;
}

// response for get question details
export interface QuestionDetail extends Omit<QuestionListItem, "user"> {
  user: QuestionListItem["user"] & { id: number };
  updatedAt?: string;
  attachment?: Attachment;
  comments?: Comment[];
  acceptedCommentId?: number | null;
  isMuted?: boolean;
}

export interface EditHistoryEntry {
  id: number;
  previousTitle?: string | null;
  previousContent: string;
  editedAt: string;
}

export interface Attachment {
  id?: number;
  fileName: string;
  mimeType: string;
  url?: string;
}

export interface Comment {
  id: number;
  user: {
    id: number | null;
    username: string;
    email?: string | null;
    displayName?: string | null;
    pictureUrl?: string | null;
    fullRoleTag?: string | null;
  };
  content: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt?: string;
  attachment?: Attachment | null;
  hasLiked: boolean;
  likeCount: number;
  parentId?: number | null;
  replies?: Comment[];
  isAccepted?: boolean;
}

// response for get interests
export interface Interest {
  id: number;
  user_id: number;
  question_id: number;
  comment_id: number | null;
  created_at: string;
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

export interface CommentSearchResult {
  id: number;
  content: string;
  createdAt: string;
  user: {
    username?: string;
    email?: string;
    displayName?: string | null;
    pictureUrl?: string | null;
    fullRoleTag?: string | null;
  };
  questionId: number;
  questionTitle: string;
}

// response for search
export interface SearchResponse {
  questions: QuestionListItem[];
  comments?: CommentSearchResult[];
  count: number;
  offset: number;
}

export interface LeaderboardEntry {
  id: number;
  username: string | null;
  displayName: string | null;
  pictureUrl: string | null;
  reputationPoints: number;
}

export interface UserStats {
  id: number;
  username: string | null;
  displayName: string | null;
  reputationPoints: number;
  questionsAsked: number;
  commentsMade: number;
  badges: string[];
}

export interface AdminQuestion {
  id: number;
  title: string;
  status: QuestionStatus;
  pinned: boolean;
  solved: boolean;
  createdAt: string;
  tags: string[];
  user: { id: number; username: string | null; email: string };
}

export interface DeletedQuestion {
  id: number;
  title: string;
  deletedAt: string;
  user: { id: number; username: string | null; email: string };
}

export interface Report {
  id: number;
  type: "question" | "comment";
  targetId: number;
  questionId?: number;
  preview: string;
  reportedBy: { id: number; username: string | null; email: string };
  createdAt: string;
}

export interface AuditLogEntry {
  id: number;
  action: string;
  targetType: string | null;
  targetId: number | null;
  details: Record<string, unknown> | null;
  createdAt: string;
  admin: { id: number; username: string | null; email: string; displayName: string | null };
}

export interface AdminInsights {
  totalQuestions: number;
  unansweredCount: number;
  avgResponseTimeHours: number | null;
  topCategories: { name: string; count: number }[];
  topTags: { tag: string; count: number }[];
  staleQuestions: { id: number; title: string; createdAt: string; ageDays: number }[];
}
