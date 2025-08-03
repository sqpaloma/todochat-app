interface UserAvatarProps {
  name: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function UserAvatar({ 
  name, 
  imageUrl, 
  size = "md",
  className = "" 
}: UserAvatarProps) {
  const sizes = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-xs", 
    lg: "w-10 h-10 text-sm"
  };

  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`${sizes[size]} rounded-full ${className}`}
      />
    );
  }

  return (
    <div className={`
      ${sizes[size]} 
      bg-gradient-to-br from-gray-400 to-gray-600 
      rounded-full flex items-center justify-center 
      text-white font-semibold
      ${className}
    `}>
      {initials}
    </div>
  );
}