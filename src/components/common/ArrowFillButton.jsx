import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const EASE = "duration-450 ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none";

const SIZES = {
  sm: {
    height: "h-9 sm:h-10",
    padding: "px-4 pr-10",
    text: "text-xs sm:text-sm font-bold",
    circle: "[--icon-circle:24px] sm:[--icon-circle:26px] [--icon-right:4px] sm:[--icon-right:5px]",
    arrowSize: "size-3 sm:size-3.5",
  },
  md: {
    height: "h-11 sm:h-12",
    padding: "px-5 sm:px-6 pr-12 sm:pr-14",
    text: "text-sm font-bold",
    circle: "[--icon-circle:32px] sm:[--icon-circle:36px] [--icon-right:6px]",
    arrowSize: "size-4 sm:size-4.5",
  },
  lg: {
    height: "h-13 sm:h-14",
    padding: "px-7 sm:px-8 pr-16 sm:pr-18",
    text: "text-base font-bold",
    circle: "[--icon-circle:40px] sm:[--icon-circle:44px] [--icon-right:7px]",
    arrowSize: "size-5",
  },
};

export default function ArrowFillButton({
  btnText = "Get Started",
  to,
  href,
  onClick,
  className = "",
  size = "md",
  gradient = false,
  bgColor = "#5E01CE",
  textColor = "#ffffff",
  fillBgColor = "#ffffff",
  fillTextColor = "#5E01CE",
  hoverFillBgColor = "#ffffff",
  hoverFillTextColor = "#5E01CE",
  arrowColor,
  hoverArrowColor,
  ...props
}) {
  const [isReady, setIsReady] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const releaseTimeoutRef = useRef(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsReady(true));
    return () => {
      window.cancelAnimationFrame(frame);
      if (releaseTimeoutRef.current) window.clearTimeout(releaseTimeoutRef.current);
    };
  }, []);

  const clearPressed = () => {
    if (releaseTimeoutRef.current) window.clearTimeout(releaseTimeoutRef.current);
    releaseTimeoutRef.current = window.setTimeout(() => {
      setIsPressed(false);
      releaseTimeoutRef.current = null;
    }, 450);
  };

  const handlePointerDown = (e) => {
    props.onPointerDown?.(e);
    if (e.pointerType === "mouse") return;
    if (releaseTimeoutRef.current) window.clearTimeout(releaseTimeoutRef.current);
    setIsPressed(true);
  };

  const handlePointerUp = (e) => {
    props.onPointerUp?.(e);
    if (e.pointerType !== "mouse") clearPressed();
  };

  const currentSize = SIZES[size] || SIZES.md;
  const hasUtilityBg = className.includes("bg-") || className.includes("from-") || className.includes("via-") || className.includes("to-");
  const bgStyleClass = gradient
    ? "bg-gradient-to-r from-[#5E01CE] via-[#8D64ED] to-[#FE00A4] border-transparent"
    : hasUtilityBg
    ? "border-transparent"
    : "bg-[var(--btn-bg)] border-[var(--btn-bg)]";

  const baseClasses = `group/btn relative inline-flex ${currentSize.height} w-fit min-w-fit max-w-none cursor-pointer items-center justify-center overflow-hidden rounded-full border ${currentSize.padding} whitespace-nowrap leading-none [text-rendering:geometricPrecision] ${currentSize.circle} [--circle-inset-y:calc((100%-var(--icon-circle))/2)] ${currentSize.text} ${bgStyleClass} text-[var(--btn-text)] select-none shadow-sm transition-all duration-300 hover:shadow-md active:scale-95 ${className}`;

  const styleObj = {
    "--btn-bg": bgColor,
    "--btn-text": textColor,
    "--btn-fill-bg": fillBgColor,
    "--btn-fill-text": fillTextColor,
    "--btn-fill-bg-hover": hoverFillBgColor,
    "--btn-fill-text-hover": hoverFillTextColor,
    "--btn-arrow": arrowColor || fillTextColor,
    "--btn-arrow-hover": hoverArrowColor || hoverFillTextColor,
    visibility: isReady ? "visible" : "hidden",
  };

  const buttonInner = (
    <>
      <span className="relative z-10 pb-px">{btnText}</span>

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute z-20 rounded-full bg-[var(--btn-fill-bg)] inset-[var(--circle-inset-y)_var(--icon-right)_var(--circle-inset-y)_calc(100%-var(--icon-right)-var(--icon-circle))] ${
          isReady
            ? `transition-all ${EASE} group-hover/btn:bg-[var(--btn-fill-bg-hover)] group-hover/btn:inset-0 group-data-[pressed=true]/btn:bg-[var(--btn-fill-bg-hover)] group-data-[pressed=true]/btn:inset-0`
            : ""
        }`}
      />

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-20 flex items-center ${currentSize.padding} text-[var(--btn-fill-text)] [clip-path:inset(var(--circle-inset-y)_var(--icon-right)_var(--circle-inset-y)_calc(100%-var(--icon-right)-var(--icon-circle)))] ${
          isReady
            ? `transition-all ${EASE} group-hover/btn:text-[var(--btn-fill-text-hover)] group-hover/btn:[clip-path:inset(0_0_0_0)] group-data-[pressed=true]/btn:text-[var(--btn-fill-text-hover)] group-data-[pressed=true]/btn:[clip-path:inset(0_0_0_0)]`
            : ""
        }`}
      >
        <span className="relative z-10 pb-px whitespace-nowrap">{btnText}</span>
      </div>

      <span
        className={`pointer-events-none absolute right-[var(--icon-right)] top-1/2 z-30 inline-flex h-[var(--icon-circle)] w-[var(--icon-circle)] shrink-0 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-[var(--btn-fill-bg)] text-[var(--btn-arrow)] ${
          isReady
            ? `transition-colors ${EASE} group-hover/btn:bg-[var(--btn-fill-bg-hover)] group-hover/btn:text-[var(--btn-arrow-hover)] group-data-[pressed=true]/btn:bg-[var(--btn-fill-bg-hover)] group-data-[pressed=true]/btn:text-[var(--btn-arrow-hover)]`
            : ""
        }`}
        style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)", maskImage: "radial-gradient(white, black)" }}
        aria-hidden="true"
      >
        <ArrowRight
          className={`absolute left-1/2 top-1/2 ${currentSize.arrowSize} translate-x-[-170%] -translate-y-1/2 origin-center scale-0 text-current ${
            isReady ? `transition-transform ${EASE} group-hover/btn:-translate-x-1/2 group-hover/btn:-translate-y-1/2 group-hover/btn:scale-100 group-data-[pressed=true]/btn:-translate-x-1/2 group-data-[pressed=true]/btn:-translate-y-1/2 group-data-[pressed=true]/btn:scale-100` : ""
          }`}
          strokeWidth={2.2}
        />
        <ArrowRight
          className={`absolute left-1/2 top-1/2 ${currentSize.arrowSize} -translate-x-1/2 -translate-y-1/2 origin-center text-current ${
            isReady ? `transition-transform ${EASE} group-hover/btn:translate-x-[170%] group-hover/btn:-translate-y-1/2 group-hover/btn:scale-0 group-data-[pressed=true]/btn:translate-x-[170%] group-data-[pressed=true]/btn:-translate-y-1/2 group-data-[pressed=true]/btn:scale-0` : ""
          }`}
          strokeWidth={2.2}
        />
      </span>
    </>
  );

  const Comp = to ? Link : href ? "a" : "button";

  return (
    <Comp
      to={to}
      href={href}
      type={!to && !href ? "button" : undefined}
      onClick={onClick}
      data-pressed={isPressed ? "true" : "false"}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={baseClasses}
      style={styleObj}
      {...props}
    >
      {buttonInner}
    </Comp>
  );
}