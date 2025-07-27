"use client";

import { usePathname } from "next/navigation";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export function ConditionalAuthHeader() {
  const pathname = usePathname();

  // Only show auth header for pages that don't have sidebar
  // Pages with sidebar: /chat, /tasks, /team
  const sidebarPages = ["/chat", "/tasks", "/team"];

  if (sidebarPages.some((page) => pathname.startsWith(page))) {
    return null;
  }

  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16">
      <SignedOut>
        <SignInButton />
        <SignUpButton>
          <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
            Sign Up
          </button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}
