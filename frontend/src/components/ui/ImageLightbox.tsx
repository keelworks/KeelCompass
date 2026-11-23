import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { useModalA11y } from "../../utils/useModalA11y";

interface ImageLightboxProps {
  src: string;
  alt?: string;
  isOpen: boolean;
  onClose: () => void;
}

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const CLICK_ZOOM_SCALE = 2.5;
const CLICK_DRAG_THRESHOLD = 6; // px of movement before a pointer-up stops counting as a "click"

type Point = { x: number; y: number };

// full-screen, zoomable/pannable image viewer - wheel + buttons + double
// click to zoom on desktop, pinch + drag to pan on touch, all zooming
// toward the cursor/midpoint rather than just the image center.
function ImageLightbox({ src, alt, isOpen, onClose }: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState<Point>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const pointersRef = useRef<Map<number, Point>>(new Map());
  const pinchStartRef = useRef<{ distance: number; scale: number } | null>(null);
  const panStartRef = useRef<{ pointer: Point; translate: Point } | null>(null);
  const pointerDownPosRef = useRef<Point | null>(null);

  // reset to a clean state every time a new image is opened
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
      pointersRef.current.clear();
      pinchStartRef.current = null;
      panStartRef.current = null;
    }
  }, [isOpen, src]);

  // Escape-to-close and focus trapping are handled by useModalA11y below;
  // this only needs the zoom-specific shortcuts
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "+" || e.key === "=") zoomBy(0.5);
      else if (e.key === "-") zoomBy(-0.5);
      else if (e.key === "0") resetZoom();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, scale, translate]);

  useModalA11y(isOpen, onClose, dialogRef);

  if (!isOpen) return null;

  const clampTranslate = (nextScale: number, next: Point): Point => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return next;
    const containerRect = container.getBoundingClientRect();
    const scaledWidth = img.offsetWidth * nextScale;
    const scaledHeight = img.offsetHeight * nextScale;
    const maxX = Math.max(0, (scaledWidth - containerRect.width) / 2);
    const maxY = Math.max(0, (scaledHeight - containerRect.height) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, next.x)),
      y: Math.min(maxY, Math.max(-maxY, next.y)),
    };
  };

  // zoom while keeping the given screen point visually anchored in place
  const zoomToward = (focal: Point, nextScaleRaw: number) => {
    const nextScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScaleRaw));
    const factor = nextScale / scale;
    const nextTranslate =
      nextScale === MIN_SCALE
        ? { x: 0, y: 0 }
        : clampTranslate(nextScale, {
            x: focal.x - (focal.x - translate.x) * factor,
            y: focal.y - (focal.y - translate.y) * factor,
          });
    setScale(nextScale);
    setTranslate(nextTranslate);
  };

  // {0, 0} is the container's own center in this component's coordinate
  // system (translate is relative to center), so it doubles as "zoom toward
  // the middle of the viewer" for the +/- buttons and keyboard shortcuts
  const zoomBy = (delta: number) => zoomToward({ x: 0, y: 0 }, scale + delta);
  const resetZoom = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  const clientToFocal = (clientX: number, clientY: number): Point => {
    const rect = containerRef.current!.getBoundingClientRect();
    return { x: clientX - (rect.left + rect.width / 2), y: clientY - (rect.top + rect.height / 2) };
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const focal = clientToFocal(e.clientX, e.clientY);
    zoomToward(focal, scale - e.deltaY * 0.0025);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };

    if (pointersRef.current.size === 2) {
      const pts = Array.from(pointersRef.current.values());
      const distance = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchStartRef.current = { distance, scale };
      panStartRef.current = null;
    } else if (pointersRef.current.size === 1 && scale > MIN_SCALE) {
      panStartRef.current = { pointer: { x: e.clientX, y: e.clientY }, translate };
      setIsDragging(true);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 2 && pinchStartRef.current) {
      const pts = Array.from(pointersRef.current.values());
      const distance = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const midpoint = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
      const ratio = distance / pinchStartRef.current.distance;
      zoomToward(clientToFocal(midpoint.x, midpoint.y), pinchStartRef.current.scale * ratio);
    } else if (panStartRef.current && pointersRef.current.size === 1) {
      const dx = e.clientX - panStartRef.current.pointer.x;
      const dy = e.clientY - panStartRef.current.pointer.y;
      setTranslate(
        clampTranslate(scale, { x: panStartRef.current.translate.x + dx, y: panStartRef.current.translate.y + dy })
      );
    }
  };

  const endPointer = (e: React.PointerEvent) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchStartRef.current = null;
    if (pointersRef.current.size === 0) {
      panStartRef.current = null;
      setIsDragging(false);
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    const downPos = pointerDownPosRef.current;
    if (downPos && Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > CLICK_DRAG_THRESHOLD) return;
    if (scale > MIN_SCALE) {
      resetZoom();
    } else {
      zoomToward(clientToFocal(e.clientX, e.clientY), CLICK_ZOOM_SCALE);
    }
  };

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={alt || "Image viewer"}
      tabIndex={-1}
      className="fixed inset-0 z-[9999] flex items-center justify-center focus:outline-none"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-backdrop-in"
        onClick={onClose}
      />

      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden touch-none select-none"
        onWheel={handleWheel}
        onClick={onClose}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt || "Attachment"}
          draggable={false}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={(e) => {
            endPointer(e);
            handleImageClick(e);
          }}
          onPointerCancel={endPointer}
          onClick={(e) => e.stopPropagation()}
          className={`max-w-[92vw] max-h-[88vh] rounded-lg shadow-2xl animate-bounce-in ${
            scale > MIN_SCALE ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"
          }`}
          style={{
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            transition: panStartRef.current || pinchStartRef.current ? "none" : "transform 150ms ease-out",
          }}
        />
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all duration-150 hover:scale-110 active:scale-95"
      >
        <X size={20} />
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1.5 animate-toast-in">
        <button
          type="button"
          onClick={() => zoomBy(-0.5)}
          aria-label="Zoom out"
          className="text-white/90 hover:text-white rounded-full p-2 hover:bg-white/10 transition-all duration-150 active:scale-90 disabled:opacity-30 disabled:pointer-events-none"
          disabled={scale <= MIN_SCALE}
        >
          <ZoomOut size={18} />
        </button>
        <button
          type="button"
          onClick={resetZoom}
          aria-label="Reset zoom"
          className="text-white/90 hover:text-white rounded-full p-2 hover:bg-white/10 transition-all duration-150 active:scale-90 disabled:opacity-30 disabled:pointer-events-none"
          disabled={scale === MIN_SCALE && translate.x === 0 && translate.y === 0}
        >
          <RotateCcw size={16} />
        </button>
        <button
          type="button"
          onClick={() => zoomBy(0.5)}
          aria-label="Zoom in"
          className="text-white/90 hover:text-white rounded-full p-2 hover:bg-white/10 transition-all duration-150 active:scale-90 disabled:opacity-30 disabled:pointer-events-none"
          disabled={scale >= MAX_SCALE}
        >
          <ZoomIn size={18} />
        </button>
      </div>
    </div>,
    document.body
  );
}

export default ImageLightbox;
