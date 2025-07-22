"use client";

import { ReactNode } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { LayoutProvider, useLayout } from "./layout-provider";

interface MainLayoutProps {
  children: ReactNode;
  activeView?: "home" | "chat" | "tasks" | "team";
}

function LayoutContent({ children, activeView }: MainLayoutProps) {
  const { sidebarOpen, closeSidebar } = useLayout();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <Header activeView={activeView} />

        {/* Content Area */}
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}

export function MainLayout({ children, activeView }: MainLayoutProps) {
  return (
    <LayoutProvider>
      <LayoutContent activeView={activeView}>{children}</LayoutContent>
    </LayoutProvider>
  );
}
