import { cn } from "@/lib/utils";

interface PresenceIndicatorProps {
  status: "online" | "offline";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
}

export function PresenceIndicator({
  status,
  size = "md",
  showIcon = true,
  showText = false,
  className,
}: PresenceIndicatorProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "online":
        return "Online";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {showIcon && (
        <div
          className={cn(
            "rounded-full border-2 border-white",
            getStatusColor(),
            sizeClasses[size]
          )}
        ></div>
      )}
      {!showIcon && (
        <div
          className={cn("rounded-full", getStatusColor(), sizeClasses[size])}
        ></div>
      )}
      {showText && (
        <span className="text-xs text-gray-500">{getStatusText()}</span>
      )}
    </div>
  );
}
