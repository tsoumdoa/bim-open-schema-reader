import { useState } from "react";
import { Button } from "@/components/ui/button";
import { denormParamQueryBuilder } from "../utils/denorm-param-query-builder";
import { FloatingButtonPosition } from "../hooks/use-super-cook";
import { useQueryObjCtx } from "./query-obj-provider";
import { DenormTableName } from "../utils/types";

interface FloatingQueryButtonProps {
  position: FloatingButtonPosition;
  sourcePosition: { x: number; y: number } | null;
  isVisible: boolean;
  onAnimationComplete?: () => void;
}

export function FloatingQueryButton({
  position,
  sourcePosition,
  isVisible,
  onAnimationComplete,
}: FloatingQueryButtonProps) {
  const { useQueryObjects } = useQueryObjCtx();
  const { addQuery } = useQueryObjects;
  const [isHovered, setIsHovered] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleFlattenClick = () => {
    const queryObj = denormParamQueryBuilder(
      position.tableName as DenormTableName,
      position.categoryName,
      false
    );
    addQuery(queryObj);
  };

  const handlePivotClick = () => {
    const queryObj = denormParamQueryBuilder(
      position.tableName as DenormTableName,
      position.categoryName,
      true
    );
    addQuery(queryObj);
  };

  const getButtonStyle = (): React.CSSProperties => {
    if (!isVisible || !sourcePosition) {
      return {
        position: "fixed",
        left: sourcePosition?.x || 0,
        top: sourcePosition?.y || 0,
        opacity: 0,
        transform: "scale(0.8)",
        transition: "none",
        zIndex: 9999,
      };
    }

    return {
      position: "fixed",
      left: position.targetX,
      top: position.targetY,
      opacity: 1,
      transform: `scale(${isHovered ? 1.1 : 1})`,
      transition: `all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${position.delay}ms`,
      zIndex: 9999,
      animationDelay: `${position.delay}ms`,
    };
  };

  const getDisplayName = () => {
    if (position.displayName.length <= 12) return position.displayName;
    return position.displayName.substring(0, 10) + "...";
  };

  return (
    <div
      style={getButtonStyle()}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onAnimationEnd={onAnimationComplete}
    >
      <div className="relative">
        <Button
          size="sm"
          className={`relative h-10 w-20 rounded-lg border border-white/20 bg-gradient-to-r from-blue-500 to-purple-600 text-xs font-medium text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${isHovered ? "floating-button-hover ring-2 ring-white/50 ring-offset-2 ring-offset-transparent" : "floating-button-glow"} ${isVisible ? "super-cook-enter" : ""} `}
          onClick={() => setShowOptions(!showOptions)}
        >
          <span className="block w-full truncate text-center">
            {getDisplayName()}
          </span>
        </Button>

        {showOptions && (
          <div className="animate-in fade-in slide-in-from-top-1 absolute top-full left-0 z-50 mt-1 min-w-[80px] rounded-lg border border-gray-200 bg-white p-1 shadow-xl duration-200">
            <button
              className="w-full rounded px-2 py-1 text-left text-xs transition-colors hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                handleFlattenClick();
                setShowOptions(false);
              }}
            >
              Flatten
            </button>
            <button
              className="w-full rounded px-2 py-1 text-left text-xs transition-colors hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                handlePivotClick();
                setShowOptions(false);
              }}
            >
              Pivot
            </button>
          </div>
        )}

        {isHovered && (
          <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 transform rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white">
            {position.displayName}
            <div className="absolute top-full left-1/2 -mt-1 -translate-x-1/2 transform">
              <div className="border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
