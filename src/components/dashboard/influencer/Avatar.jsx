"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "../../../lib/utils";

const AvatarRoot = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-zinc-200/80 bg-zinc-100 shadow-xs",
      className
    )}
    {...props}
  />
));
AvatarRoot.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-zinc-100 text-zinc-900 font-bold",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

// Universal Avatar supporting both direct props (<Avatar name="..." avatarUrl="..." size={56} />)
// and compound components (<Avatar><AvatarImage .../><AvatarFallback>...</AvatarFallback></Avatar>)
const Avatar = React.forwardRef(
  ({ name, avatarUrl, avatar, size, className, children, ...props }, ref) => {
    if (children) {
      return (
        <AvatarRoot
          ref={ref}
          className={className}
          style={size ? { width: size, height: size, ...props.style } : props.style}
          {...props}
        >
          {children}
        </AvatarRoot>
      );
    }

    const src = avatarUrl || avatar;
    const initial = name?.trim()?.[0]?.toUpperCase() || "?";
    const customStyle = size
      ? {
          width: size,
          height: size,
          fontSize: Math.max(11, Math.round(size * 0.38)),
          ...props.style,
        }
      : props.style;

    return (
      <AvatarRoot ref={ref} className={className} style={customStyle} {...props}>
        {src && (
          <AvatarImage
            src={src}
            alt={name || "Avatar"}
            referrerPolicy="no-referrer"
          />
        )}
        <AvatarFallback>{initial}</AvatarFallback>
      </AvatarRoot>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar, AvatarImage, AvatarFallback, AvatarRoot };
export default Avatar;