import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function SegmentedProgress({
  value: initialValue = 80,
  segments = 20,
  label,
  showPercentage = true,
  showDemo = false,
  className,
}) {
  const [progress, setProgress] = useState(initialValue);
  const value = showDemo ? progress : initialValue;

  const [displayValue, setDisplayValue] = useState(0);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const animationRef = useRef(null);
  const startValueRef = useRef(0);
  const startTimeRef = useRef(0);

  const filledSegments = Math.round((displayValue / 100) * segments);

  useEffect(() => {
    if (!isInitialized) {
      const initTimeout = setTimeout(() => setIsInitialized(true), 50);
      return () => clearTimeout(initTimeout);
    }

    const duration = 800;
    startValueRef.current = displayValue;
    startTimeRef.current = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTimeRef.current;
      const animProgress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - animProgress, 3);

      const newValue = startValueRef.current + (value - startValueRef.current) * eased;
      setDisplayValue(newValue);

      if (animProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, isInitialized]);

  const getSegmentStyle = (index, isFilled) => {
    let scale = 1;
    const opacity = 1;
    let translateY = 0;

    if (hoveredSegment !== null) {
      const distance = Math.abs(hoveredSegment - index);
      if (distance === 0) {
        scale = 1.3;
        translateY = -1;
      } else if (distance <= 3) {
        const falloff = Math.cos((distance / 3) * (Math.PI / 2));
        scale = 1 + 0.2 * falloff;
        translateY = -0.5 * falloff;
      }
    }

    const delay = isInitialized ? index * 20 : 0;

    return {
      transform: `scaleY(${scale}) translateY(${translateY}px)`,
      transitionDelay: `${delay}ms`,
      opacity,
    };
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-2">
        {/* Header with label and percentage */}
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-xs font-semibold text-[var(--color-text-light)] tracking-wide">
              {label}
            </span>
          )}
          {showPercentage && (
            <span
              className="text-xs font-bold text-[var(--color-text)] tabular-nums tracking-tight transition-all duration-300"
              style={{
                filter: hoveredSegment !== null ? "brightness(1.2)" : "brightness(1)",
              }}
            >
              {Math.round(displayValue)}%
            </span>
          )}
        </div>

        {/* Segmented bar */}
        <div
          className="flex gap-[3px] py-1"
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {Array.from({ length: segments }).map((_, index) => {
            const isFilled = index < filledSegments;
            const isHovered = hoveredSegment === index;

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredSegment(index)}
                onMouseLeave={() => setHoveredSegment(null)}
                className={cn(
                  "h-2.5 flex-1 rounded-[3px] cursor-pointer origin-center",
                  "transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                  isFilled ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]/60",
                  isHovered && isFilled && "brightness-110 shadow-[0_0_12px_var(--color-primary)]",
                  isHovered && !isFilled && "bg-[var(--color-border)]",
                  hoveredSegment !== null && !isFilled && !isHovered && "bg-[var(--color-border)]/40"
                )}
                style={getSegmentStyle(index, isFilled)}
              />
            );
          })}
        </div>
      </div>

      {showDemo && (
        <div className="flex flex-col gap-2 mt-2">
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full h-1.5 bg-[var(--color-border)] rounded-full appearance-none cursor-pointer
              transition-all duration-300
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-[var(--color-primary)]
              [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <p className="text-center text-[11px] text-[var(--color-text-light)]">Drag to test preview</p>
        </div>
      )}
    </div>
  );
}

export default SegmentedProgress;
