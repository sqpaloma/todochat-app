import { User } from "@/types/user";

export function getDisplayName(user: User | null | undefined): string {
  if (!user) {
    return "Anonymous";
  }

  // Try to get name from firstName and lastName
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

  if (fullName.trim()) {
    return fullName;
  }

  // Fallback to email username
  if (user.email) {
    const emailUsername = user.email.split("@")[0];
    return emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1);
  }

  return "Anonymous";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
}
