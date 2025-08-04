"use client";

import type React from "react";
import "./globals.css";
import { ConvexClientProvider } from "./convex-provider";
import { AppProvider } from "@/contexts/app-context";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { Sidebar } from "@/components/sidebar";
import { MobileMenuButton } from "@/components/mobile-menu-button";
import { Footer } from "@/components/footer";
import { useAppContext } from "@/contexts/app-context";

// Layout hook using AppContext
export function useLayout() {
  const { state, setSidebarOpen, toggleSidebar } = useAppContext();

  return {
    sidebarOpen: state.sidebarOpen,
    toggleSidebar,
    closeSidebar: () => setSidebarOpen(false),
    openSidebar: () => setSidebarOpen(true),
  };
}

// Conditional Auth Header Component
function ConditionalAuthHeader() {
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

// Home Layout Component
function HomeLayoutContent({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Content Area - Full width, full height */}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

// Sidebar Layout Component
function SidebarLayoutContent({
  children,
}: {
  children: ReactNode;
  activeView?: "chat" | "tasks" | "team";
}) {
  const { sidebarOpen, closeSidebar } = useLayout();
  const { isSignedIn, isLoaded } = useAuth();

  // Don't show sidebar if user is not authenticated
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    // Show full-screen content without sidebar when not authenticated
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="min-h-screen">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Always render, but hidden on mobile when closed */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Mobile Menu Button - Only shown when authenticated */}
      <MobileMenuButton />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 lg:ml-0">
        {/* Content Area - Full height without header */}
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}

// Layout initialization component
function LayoutInitializer({ children }: { children: ReactNode }) {
  const { setSidebarOpen } = useAppContext();

  // Initialize sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024;
      setSidebarOpen(isDesktop);
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to avoid infinite loop

  return <>{children}</>;
}

// Layout Content Router
function LayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Determine which layout to use based on pathname
  const isHomePage = pathname === "/";
  const isLoginPage = pathname === "/login";
  const isSidebarPage = ["/chat", "/tasks", "/team"].some((page) =>
    pathname.startsWith(page)
  );

  if (isHomePage) {
    return <HomeLayoutContent>{children}</HomeLayoutContent>;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isSidebarPage) {
    return <SidebarLayoutContent>{children}</SidebarLayoutContent>;
  }

  // Default layout with conditional auth header
  return (
    <div className="min-h-screen flex flex-col">
      <ConditionalAuthHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function LayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <LayoutInitializer>
      <LayoutContent>{children}</LayoutContent>
    </LayoutInitializer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-jakarta">
        <ConvexClientProvider>
          <AppProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </AppProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
