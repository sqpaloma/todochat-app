import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind utility (from shadcn/ui)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting
export function formatJoinDate(timestamp?: number): string {
  if (!timestamp) return "Date not provided";
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}

// File utilities
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Text utilities  
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getDisplayName(user: { firstName?: string; lastName?: string; email?: string } | null): string {
  if (!user) return "Anonymous";
  
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  if (fullName.trim()) return fullName;
  
  if (user.email) {
    const emailUsername = user.email.split("@")[0];
    return emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1);
  }
  
  return "Anonymous";
}