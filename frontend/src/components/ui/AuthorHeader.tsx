import React from "react";

interface AuthorHeaderProps {
  pictureUrl?: string | null;
  displayName: string;
  email?: string | null;
  roleTag?: string | null;
  dateLabel: string;
  afterDate?: React.ReactNode;
  avatarSize?: "sm" | "md";
  rightSlot?: React.ReactNode;
}

// Shared post/comment header: avatar, "Name <email>", role beneath it, and
// the timestamp beneath that - used identically across post cards, the full
// post view, and every level of comment so the whole app reads as one format.
function AuthorHeader({
  pictureUrl,
  displayName,
  email,
  roleTag,
  dateLabel,
  afterDate,
  avatarSize = "sm",
  rightSlot,
}: AuthorHeaderProps) {
  const dims = avatarSize === "md" ? "w-9 h-9 text-sm" : "w-7 h-7 text-xs";
  const authorLabel = email ? `${displayName} <${email}>` : displayName;

  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-start gap-2 min-w-0">
        {pictureUrl ? (
          <img
            src={pictureUrl}
            alt=""
            referrerPolicy="no-referrer"
            className={`${dims} rounded-full object-cover shrink-0 mt-0.5 ring-1 ring-black/5 dark:ring-white/10`}
          />
        ) : (
          <div
            className={`${dims} shrink-0 mt-0.5 flex items-center justify-center rounded-full bg-gradient-to-br from-brand-650 to-brand-900 text-white font-semibold`}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 leading-snug">
          <div className="font-semibold text-brand-800 dark:text-teal-300 text-sm break-words">
            {authorLabel}
          </div>
          {roleTag && (
            <div className="text-[11px] font-medium text-gray-400 dark:text-gray-500 tracking-wide mt-0.5">
              {roleTag}
            </div>
          )}
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
            <span>{dateLabel}</span>
            {afterDate}
          </div>
        </div>
      </div>
      {rightSlot}
    </div>
  );
}

export default AuthorHeader;
