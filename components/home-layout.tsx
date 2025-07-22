"use client";

import { ReactNode } from "react";
import { Header } from "./header";
import { LayoutProvider, useLayout } from "./layout-provider";

interface HomeLayoutProps {
  children: ReactNode;
}

function HomeLayoutContent({ children }: HomeLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header only */}
      <Header activeView="home" />

      {/* Content Area */}
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
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
