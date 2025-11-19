import React from "react";

interface DiscardModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DiscardModal: React.FC<DiscardModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="bg-white rounded-lg shadow-lg"
        style={{
          width: 489,
          height: 200,
          padding: 32,
          borderRadius: 9,
          boxShadow:
            "0px 8px 8px -4px rgba(10, 13, 18, 0.04), 0px 0px 24px -4px rgba(10, 13, 18, 0.1)",
        }}
      >
        <div className="flex flex-col gap-8">
          {/* Header with title and close button */}
          <div className="flex items-start justify-between">
            <h2
              style={{
                fontFamily: "Raleway, sans-serif",
                fontWeight: 600,
                fontSize: 20,
                lineHeight: "28px",
                color: "#212121",
              }}
            >
              Discard question?
            </h2>
            <button
              onClick={onCancel}
              className="flex items-center justify-center transition-all"
              style={{
                width: 36,
                height: 36,
                borderRadius: 4,
                border: "none",
                backgroundColor: "transparent",
                padding: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#EDF2F2";
                e.currentTarget.style.border = "1px solid #E8F4F5";
                e.currentTarget.style.boxShadow = "1px 0px 2px 0px #617E8014";
                const svg = e.currentTarget.querySelector("path");
                if (svg) svg.setAttribute("stroke", "#007C88");
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.border = "2px solid #666A6F";
                e.currentTarget.style.boxShadow = "none";
                const svg = e.currentTarget.querySelector("path");
                if (svg) svg.setAttribute("stroke", "#666A6F");
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.backgroundColor = "#C8E9E9";
                e.currentTarget.style.border = "1px solid #D2EEF0";
                e.currentTarget.style.boxShadow = "none";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.backgroundColor = "#EDF2F2";
                e.currentTarget.style.border = "1px solid #E8F4F5";
                e.currentTarget.style.boxShadow = "1px 0px 2px 0px #617E8014";
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = "2px solid #007C88";
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = "2px solid #666A6F";
              }}
              aria-label="Close modal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="#666A6F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Body text */}
          <p
            style={{
              fontFamily: "Lato, sans-serif",
              fontWeight: 400,
              fontSize: 18,
              lineHeight: "100%",
              color: "#212121",
            }}
          >
            Are you sure you want to discard your question draft?
          </p>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-4">
            <button
              onClick={onCancel}
              className="rounded-lg border-2 transition hover:bg-gray-50"
              style={{
                width: 112, // added
                height: 44, // added
                borderColor: "#05808F",
                color: "#05808F",
                backgroundColor: "white",
                fontWeight: 600,
              }}
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="rounded-lg transition hover:bg-red-800"
              style={{
                width: 112, // added
                height: 44, // added
                backgroundColor: "#B91C1C",
                color: "white",
                fontWeight: 600,
                border: "none",
              }}
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscardModal;
