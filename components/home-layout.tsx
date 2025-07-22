"use client";

import { ReactNode } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { MobileMenuButton } from "./mobile-menu-button";
import { LayoutProvider, useLayout } from "./layout-provider";

interface HomeLayoutProps {
  children: ReactNode;
}

function HomeLayoutContent({ children }: HomeLayoutProps) {
  const { sidebarOpen, closeSidebar } = useLayout();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for all screen sizes */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <MobileMenuButton />

      {/* Header only for desktop (hidden on mobile) */}
      <div className="hidden lg:block">
        <Header activeView="home" />
      </div>

      {/* Content Area - Full height on mobile, with header space on desktop */}
      <main className="min-h-screen lg:min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}

export function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <LayoutProvider>
      <HomeLayoutContent>{children}</HomeLayoutContent>
    </LayoutProvider>
  );
}
