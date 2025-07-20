"use client";

import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  CheckSquare,
  Users,
  Home,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  activeView?: "home" | "chat" | "tasks" | "team";
  onViewChange?: (view: "home" | "chat" | "tasks" | "team") => void;
  selectedTeam?: string;
  onTeamChange?: (team: string) => void;
}

export function Header({
  activeView,
  onViewChange,
  selectedTeam,
  onTeamChange,
}: HeaderProps) {
  const pathname = usePathname();

  // Determine active view from pathname if not provided
  const currentView =
    activeView ||
    (pathname === "/"
      ? "home"
      : pathname === "/tasks"
        ? "tasks"
        : pathname === "/chat"
          ? "chat"
          : pathname === "/team"
            ? "team"
            : "home");

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold gradient-text">Chat do ✨</h1>
        </div>

        <nav className="flex items-center space-x-2">
          <Link href="/">
            <Button
              variant={currentView === "home" ? "default" : "ghost"}
              className={`px-6 py-2.5 rounded-2xl font-semibold transition-all duration-300 ${
                currentView === "home"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
              }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Início
            </Button>
          </Link>

          <Link href="/tasks">
            <Button
              variant={currentView === "tasks" ? "default" : "ghost"}
              className={`px-6 py-2.5 rounded-2xl font-semibold transition-all duration-300 ${
                currentView === "tasks"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <CheckSquare className="w-4 h-4 mr-2" />
              Tasks
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                3
              </span>
            </Button>
          </Link>

          <Link href="/chat">
            <Button
              variant={currentView === "chat" ? "default" : "ghost"}
              className={`px-6 py-2.5 rounded-2xl font-semibold transition-all duration-300 ${
                currentView === "chat"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "text-gray-600 hover:text-green-600 hover:bg-green-50"
              }`}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
              <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </Button>
          </Link>

          <Link href="/team">
            <Button
              variant={currentView === "team" ? "default" : "ghost"}
              className={`px-6 py-2.5 rounded-2xl font-semibold transition-all duration-300 ${
                currentView === "team"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              Equipe
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
