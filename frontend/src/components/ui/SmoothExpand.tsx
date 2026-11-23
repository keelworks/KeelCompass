import { useEffect, useRef, useState } from "react";

interface SmoothExpandProps {
  children: React.ReactNode;
  className?: string;
}

// animates height to whatever its content currently measures, so swapping
// between differently-sized children (e.g. a compact card vs. its expanded
// form) - or the content simply growing/shrinking in place - always
// transitions smoothly instead of jumping. Driven by ResizeObserver rather
// than a prop/key diff, so it also catches content that grows after the
// swap already happened (data finishing a fetch, a reply being added, etc).
function SmoothExpand({ children, className = "" }: SmoothExpandProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">("auto");

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    const observer = new ResizeObserver((entries) => {
      setHeight(entries[0].contentRect.height);
    });
    observer.observe(inner);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{ height, overflowY: "hidden", transition: "height 320ms cubic-bezier(0.4, 0, 0.2, 1)" }}
      className={className}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

export default SmoothExpand;
