import { UserActionType } from "./types";

export const REACTION_TYPES = [
  UserActionType.Like,
  UserActionType.Celebrate,
  UserActionType.Support,
  UserActionType.Love,
  UserActionType.Insightful,
  UserActionType.Curious,
] as const;

export type ReactionType = (typeof REACTION_TYPES)[number];

export const REACTION_META: Record<ReactionType, { emoji: string; label: string }> = {
  [UserActionType.Like]: { emoji: "👍", label: "Like" },
  [UserActionType.Celebrate]: { emoji: "🎉", label: "Celebrate" },
  [UserActionType.Support]: { emoji: "🤝", label: "Support" },
  [UserActionType.Love]: { emoji: "❤️", label: "Love" },
  [UserActionType.Insightful]: { emoji: "💡", label: "Insightful" },
  [UserActionType.Curious]: { emoji: "🤔", label: "Curious" },
};
