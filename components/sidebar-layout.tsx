"use client";

import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { MobileMenuButton } from "./mobile-menu-button";
import { LayoutProvider, useLayout } from "./layout-provider";

interface SidebarLayoutProps {
  children: ReactNode;
  activeView?: "chat" | "tasks" | "team";
}

function SidebarLayoutContent({ children, activeView }: SidebarLayoutProps) {
  const { sidebarOpen, closeSidebar } = useLayout();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar only */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Mobile Menu Button */}
      <MobileMenuButton />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Content Area - Full height without header */}
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}

export function SidebarLayout({ children, activeView }: SidebarLayoutProps) {
  return (
    <LayoutProvider>
      <SidebarLayoutContent activeView={activeView}>
        {children}
      </SidebarLayoutContent>
    </LayoutProvider>
  );
}
