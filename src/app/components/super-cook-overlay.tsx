import { useEffect, useState } from "react";
import { FloatingQueryButton } from "./floating-query-button";

interface SuperCookOverlayProps {
  isActive: boolean;
  onClose: () => void;
  queryItemPositions: Array<{
    categoryName: string;
    tableName: string;
    displayName: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  floatingButtonPositions: Array<{
    categoryName: string;
    tableName: string;
    displayName: string;
    targetX: number;
    targetY: number;
    delay: number;
  }>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function SuperCookOverlay({
  isActive,
  onClose,
  queryItemPositions,
  floatingButtonPositions,
  containerRef,
}: SuperCookOverlayProps) {
  const [showButtons, setShowButtons] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (isActive) {
      // Small delay before showing buttons for smooth entrance
      const timer = setTimeout(() => {
        setShowButtons(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setShowButtons(false);
      setAnimationComplete(false);
    }
  }, [isActive]);

  const handleAnimationComplete = () => {
    setAnimationComplete(true);
  };

  const getSourcePosition = (tableName: string) => {
    const sourceItem = queryItemPositions.find(
      (item) => item.tableName === tableName
    );
    if (sourceItem) {
      return {
        x: sourceItem.x,
        y: sourceItem.y,
      };
    }
    return null;
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background overlay */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-md transition-all duration-300"
        onClick={onClose}
        style={{
          backgroundColor: animationComplete
            ? "rgba(0, 0, 0, 0.2)"
            : "rgba(0, 0, 0, 0.4)",
        }}
      />

      {/* Instructions */}
      <div className="absolute top-8 left-1/2 z-50 -translate-x-1/2 transform text-center">
        <div className="rounded-lg border border-white/20 bg-white/90 px-6 py-3 shadow-lg backdrop-blur-sm">
          <h2 className="mb-1 text-lg font-semibold text-gray-800">
            Super Cook Mode
          </h2>
          <p className="text-sm text-gray-600">
            Press ESC or click outside to exit
          </p>
        </div>
      </div>

      {/* Floating buttons container */}
      <div
        ref={containerRef}
        className="relative h-full w-full"
        style={{ pointerEvents: "none" }}
      >
        {floatingButtonPositions.map((position, index) => (
          <div
            key={`${position.tableName}-${index}`}
            style={{ pointerEvents: "auto" }}
          >
            <FloatingQueryButton
              position={position}
              sourcePosition={getSourcePosition(position.tableName)}
              isVisible={showButtons}
              onAnimationComplete={
                index === floatingButtonPositions.length - 1
                  ? handleAnimationComplete
                  : undefined
              }
            />
          </div>
        ))}
      </div>

      {/* Keyboard shortcut hint */}
      <div className="absolute bottom-8 left-1/2 z-50 -translate-x-1/2 transform">
        <div className="rounded-lg border border-white/20 bg-white/90 px-4 py-2 shadow-lg backdrop-blur-sm">
          <p className="text-xs text-gray-600">
            <span className="rounded bg-gray-100 px-1 py-0.5 font-mono">
              ⌘⇧Space
            </span>{" "}
            to toggle •
            <span className="ml-1 rounded bg-gray-100 px-1 py-0.5 font-mono">
              ESC
            </span>{" "}
            to exit
          </p>
        </div>
      </div>
    </div>
  );
}
