"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { MobileMenuButton } from "@/components/mobile-menu-button";

// Layout Context
interface LayoutContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
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
  const { sidebarOpen, closeSidebar } = useLayout();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Always render, but hidden on mobile when closed */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Mobile Menu Button - Only visible on mobile */}
      <MobileMenuButton />

      {/* Header only for desktop (hidden on mobile) */}
      <div className="hidden lg:block">
        <Header activeView="home" />
      </div>

      {/* Content Area - Full width on desktop, full height on mobile, with header space on desktop */}
      <main className="min-h-screen lg:min-h-[calc(100vh-4rem)] lg:ml-0">
        {children}
      </main>
    </div>
  );
}

// Sidebar Layout Component
function SidebarLayoutContent({
  children,
  activeView,
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

// Main Layout Provider Component
function LayoutProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize sidebar state based on screen size
  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;

    if (isDesktop) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  return (
    <LayoutContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        closeSidebar,
        openSidebar,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

// Layout Content Router
function LayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Determine which layout to use based on pathname
  const isHomePage = pathname === "/";
  const isSidebarPage = ["/chat", "/tasks", "/team"].some((page) =>
    pathname.startsWith(page)
  );

  // Get active view for sidebar pages
  const getActiveView = (): "chat" | "tasks" | "team" | undefined => {
    if (pathname.startsWith("/chat")) return "chat";
    if (pathname.startsWith("/tasks")) return "tasks";
    if (pathname.startsWith("/team")) return "team";
    return undefined;
  };

  if (isHomePage) {
    return <HomeLayoutContent>{children}</HomeLayoutContent>;
  }

  if (isSidebarPage) {
    return (
      <SidebarLayoutContent activeView={getActiveView()}>
        {children}
      </SidebarLayoutContent>
    );
  }

  // Default layout with conditional auth header
  return (
    <>
      <ConditionalAuthHeader />
      {children}
    </>
  );
}

export function LayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <LayoutProvider>
      <LayoutContent>{children}</LayoutContent>
    </LayoutProvider>
  );
}
