import { Button } from "@/components/ui/button";
import { gradients } from "@/lib/design-system";
import { ReactNode } from "react";

interface GradientButtonProps {
  children: ReactNode;
  variant?: keyof typeof gradients;
  size?: "sm" | "default" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function GradientButton({ 
  children, 
  variant = "primary",
  size = "default",
  className = "",
  ...props 
}: GradientButtonProps) {
  const hoverVariant = variant === "primary" ? gradients.primaryHover : gradients[variant];
  
  return (
    <Button
      className={`
        bg-gradient-to-r ${gradients[variant]}
        hover:${hoverVariant}
        text-white border-0 shadow-lg
        transition-all duration-200
        ${className}
      `}
      size={size}
      {...props}
    >
      {children}
    </Button>
  );
}