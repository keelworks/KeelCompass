import React, { useEffect } from "react";

interface SnackbarProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

const Snackbar: React.FC<SnackbarProps> = ({
  message,
  isOpen,
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-50 flex items-center justify-between"
      style={{
        bottom: 96,
        right: 24,
        width: 343,
        height: 48,
        borderRadius: 4,
        paddingTop: 3,
        paddingRight: 16,
        paddingBottom: 3,
        paddingLeft: 16,
        backgroundColor: "#BBF7D0",
      }}
    >
      {/* Success Icon and Message */}
      <div className="flex items-center" style={{ gap: 24 }}>
        {/* Success Checkmark Icon */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ flexShrink: 0 }}
        >
          <path
            d="M20 6L9 17L4 12"
            stroke="#16A34A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Message Text */}
        <span
          style={{
            fontFamily: "Lato, sans-serif",
            fontWeight: 500,
            fontSize: 18,
            lineHeight: "100%",
            letterSpacing: 0,
            color: "#212121",
            whiteSpace: "nowrap",
          }}
        >
          {message}
        </span>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 transition"
        aria-label="Close notification"
        style={{ marginLeft: 24 }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.5 2.5L2.5 9.5M2.5 2.5L9.5 9.5"
            stroke="var(--Elegant-gray, #666A6F)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default Snackbar;
