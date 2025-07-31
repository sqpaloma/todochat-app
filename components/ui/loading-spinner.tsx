"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  text = "Loading...",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-32 w-32",
  };

  return (
    <div
      className={`flex items-center justify-center h-full bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 ${className}`}
    >
      <div className="text-center">
        <div
          className={`animate-spin rounded-full border-b-2 border-purple-500 mx-auto mb-4 ${sizeClasses[size]}`}
        ></div>
        {text && <p className="text-gray-600">{text}</p>}
      </div>
    </div>
  );
}
