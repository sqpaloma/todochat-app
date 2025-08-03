import { LucideIcon } from "lucide-react";
import { gradients } from "@/lib/design-system";

interface GradientIconProps {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  variant?: keyof typeof gradients;
  className?: string;
}

export function GradientIcon({ 
  icon: Icon, 
  size = "md", 
  variant = "primary",
  className = "" 
}: GradientIconProps) {
  const sizes = {
    sm: { container: "w-8 h-8 rounded-lg", icon: "w-4 h-4" },
    md: { container: "w-10 h-10 rounded-xl", icon: "w-5 h-5" },
    lg: { container: "w-12 h-12 rounded-xl", icon: "w-6 h-6" }
  };

  return (
    <div className={`
      ${sizes[size].container}
      bg-gradient-to-br ${gradients[variant]}
      flex items-center justify-center
      ${className}
    `}>
      <Icon className={`${sizes[size].icon} text-white`} />
    </div>
  );
}