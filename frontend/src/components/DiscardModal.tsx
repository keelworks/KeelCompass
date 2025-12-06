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
          padding: "24px 32px 32px 32px",

          borderRadius: 9,
          boxShadow:
            "0px 8px 8px -4px rgba(10, 13, 18, 0.04), 0px 0px 24px -4px rgba(10, 13, 18, 0.1)",
        }}
      >
        <div
          className="flex flex-col gap-6"
          style={{
            width: 425,
            height: 60,
          }}
        >
          {/* Header with title and close button */}
          <div className="flex items-start justify-between">
            <h2
              style={{
                fontFamily: "Raleway, sans-serif",
                fontWeight: 600,
                fontSize: 20,
                lineHeight: "28px",
                color: " #323232",
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
                outline: "none", // start with no outline
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
                e.currentTarget.style.outline = "none"; // ensure outline removed on mouse exit
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
                // focus state: teal outline, independent of border
                e.currentTarget.style.outline = "2px solid #007C88";
                e.currentTarget.style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                // remove focus outline
                e.currentTarget.style.outline = "none";
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
          <div
            className="flex items-center justify-end gap-8"
            style={{
              width: 425,
              height: 44,
            }}
          >
            <button
              onClick={onCancel}
              className="rounded-lg transition"
              style={{
                width: 112,
                height: 44,
                backgroundColor: "white", // Normal
                color: "#007C88",
                fontWeight: 600,
                border: "1px solid #007C88", // Normal border
                boxShadow: "0px 1px 2px 0px #0000000D", // Normal shadow
                outline: "none",
              }}
              onMouseEnter={(e) => {
                // Hover
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.border = "1px solid #00545C";
                e.currentTarget.style.boxShadow = "2px 3px 4px 0px #0000001A";
                e.currentTarget.style.color = "#007C88";
              }}
              onMouseLeave={(e) => {
                // Back to Normal
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.border = "1px solid #007C88";
                e.currentTarget.style.boxShadow = "0px 1px 2px 0px #0000000D";
                e.currentTarget.style.color = "#007C88";
                e.currentTarget.style.outline = "none";
              }}
              onMouseDown={(e) => {
                // Pressed
                e.currentTarget.style.backgroundColor = "#409EA5";
                e.currentTarget.style.border = "2px solid #007C88";
                e.currentTarget.style.boxShadow = "0px 1px 2px 0px #0000000D";
                e.currentTarget.style.color = "#FFFFFF";
              }}
              onMouseUp={(e) => {
                // Return to Hover state after press
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.border = "1px solid #00545C";
                e.currentTarget.style.boxShadow = "2px 3px 4px 0px #0000001A";
                e.currentTarget.style.color = "#007C88";
              }}
              onFocus={(e) => {
                // Focus
                e.currentTarget.style.backgroundColor = "#007C88";
                e.currentTarget.style.boxShadow = "0px 1px 2px 0px #0A0D120D";
                e.currentTarget.style.color = "#FFFFFF";
                e.currentTarget.style.outline = "none";
              }}
              onBlur={(e) => {
                // Back to Normal
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.border = "1px solid #007C88";
                e.currentTarget.style.boxShadow = "0px 1px 2px 0px #0000000D";
                e.currentTarget.style.color = "#007C88";
                e.currentTarget.style.outline = "none";
              }}
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="rounded-lg transition"
              style={{
                width: 112,
                height: 44,
                backgroundColor: "#B91C1C",
                color: "white",
                fontWeight: 600,
                border: "none",
                boxShadow: "0px 1px 2px 0px #0000000D",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#D45151";
                e.currentTarget.style.border = "2px solid #B91C1C";
                e.currentTarget.style.boxShadow = "0px 1px 2px 0px #0000000D";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#B91C1C";
                e.currentTarget.style.border = "none";
                e.currentTarget.style.boxShadow = "0px 1px 2px 0px #0000000D";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.backgroundColor = "#991B1B";
                e.currentTarget.style.border = "2px solid #B91C1C"; // Press
                e.currentTarget.style.boxShadow = "2px 3px 4px 0px #0A0D121A";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.backgroundColor = "#D45151"; // Hover
                e.currentTarget.style.border = "2px solid #B91C1C"; // Hover
                e.currentTarget.style.boxShadow = "0px 1px 2px 0px #0000000D";
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
