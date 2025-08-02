"use client";

import { Menu } from "lucide-react";
import { useLayout } from "@/app/layout-wrapper";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export function MobileMenuButton() {
  const { sidebarOpen, toggleSidebar } = useLayout();
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth();

  // Debug logs
  console.log("MobileMenuButton Debug:", {
    sidebarOpen,
    isSignedIn,
    isLoaded,
    pathname,
  });

  // Don't show mobile menu button if user is not authenticated
  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <>
      {/* Floating Menu Button - Only show when sidebar is closed on mobile */}
      {!sidebarOpen && (
        <button
          type="button"
          className="fixed top-4 left-4 z-[80] lg:hidden p-3 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          onClick={toggleSidebar}
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      )}
    </>
  );
}
