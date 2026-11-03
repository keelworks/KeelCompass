interface AskQuestionButtonProps {
  disabled?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function AskQuestionButton({ disabled = false, onClick }: AskQuestionButtonProps) {
  return (
    <button
      disabled={disabled}
      className="w-full h-[38px] flex items-center justify-center gap-[8px]
    rounded-[9px] text-white font-medium text-[16px]
    transition-all duration-150 focus:outline-none
    disabled:cursor-not-allowed"
      style={{
        background: disabled ? "#007C8833" : "#007C88",
        border: "none",
        borderRadius: disabled ? "8px" : "9px",
        boxShadow: disabled ? "none" : "0px 6px 10px 0px #0000001A",
        outline: "none",
        outlineOffset: "0px",
        padding: "16px",
        minWidth: "296px",
        transform: disabled ? "translate(-4px, 4px)" : "none",
      }}
      onMouseEnter={(e) => {
        if (e.currentTarget.disabled) return;
        e.currentTarget.style.background = "#066A71";
        e.currentTarget.style.border = "none";
        e.currentTarget.style.boxShadow = "2px 3px 4px 0px #0000001A";
        e.currentTarget.style.outline = "2px solid #007C88";
        e.currentTarget.style.outlineOffset = "2px";
      }}
      onMouseLeave={(e) => {
        if (e.currentTarget.disabled) return;
        e.currentTarget.style.background = "#007C88";
        e.currentTarget.style.border = "none";
        e.currentTarget.style.boxShadow = "0px 6px 10px 0px #0000001A";
        e.currentTarget.style.outline = "none";
        e.currentTarget.style.outlineOffset = "0px";
      }}
      onMouseDown={(e) => {
        e.currentTarget.focus();
        if (e.currentTarget.disabled) return;
        e.currentTarget.style.background = "#409EA5";
        e.currentTarget.style.border = "none";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.outline = "2px solid #007C88";
        e.currentTarget.style.outlineOffset = "2px";
      }}
      onMouseUp={(e) => {
        if (e.currentTarget.disabled) return;
        e.currentTarget.style.background = "#066A71";
        e.currentTarget.style.border = "none";
        e.currentTarget.style.boxShadow = "2px 3px 4px 0px #0000001A";
        e.currentTarget.style.outline = "2px solid #007C88";
        e.currentTarget.style.outlineOffset = "2px";
      }}
      onFocus={(e) => {
        if (e.currentTarget.disabled) return;
        e.currentTarget.style.background = "#007C88";
        e.currentTarget.style.border = "none";
        e.currentTarget.style.boxShadow = "0px 8px 12px 0px #0000001A";
      }}
      onBlur={(e) => {
        if (e.currentTarget.disabled) return;
        e.currentTarget.style.background = "#007C88";
        e.currentTarget.style.border = "none";
        e.currentTarget.style.boxShadow = "0px 6px 10px 0px #0000001A";
      }}
      onClick={(e) => {
        if (disabled) return;
        const button = e.currentTarget;
        button?.style.setProperty("outline", "none");
        button?.style.setProperty("outline-offset", "0px");
        button?.style.setProperty("border", "none");
        onClick(e);
      }}
    >
      <span className="text-[18px] font-medium">+</span>
      Ask Question
    </button>
  );
}

export default AskQuestionButton;
