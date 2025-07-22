"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MessageSquare,
  CheckSquare,
  Users,
  Settings,
  LogOut,
  User,
  Bell,
  Search,
  Plus,
  ChevronDown,
  Sparkles,
  Calendar,
  BarChart3,
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTeam, setActiveTeam] = useState("Equipe Principal");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (windowWidth < 1024) {
      // Only on mobile
      onClose();
    }
  }, [pathname, onClose, windowWidth]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen && windowWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, windowWidth]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navigationItems = [
    {
      name: "Início",
      href: "/",
      icon: Home,
      active: pathname === "/",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: CheckSquare,
      active: pathname === "/tasks",
      gradient: "from-blue-500 to-cyan-500",
      badge: "3",
    },
    {
      name: "Chat",
      href: "/chat",
      icon: MessageSquare,
      active: pathname === "/chat",
      gradient: "from-green-500 to-emerald-500",
      indicator: true,
    },
    {
      name: "Equipe",
      href: "/team",
      icon: Users,
      active: pathname === "/team",
      gradient: "from-orange-500 to-red-500",
    },
    {
      name: "Calendário",
      href: "/calendar",
      icon: Calendar,
      active: pathname === "/calendar",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      name: "Relatórios",
      href: "/reports",
      icon: BarChart3,
      active: pathname === "/reports",
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && windowWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[999]"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 bottom-0 bg-white shadow-2xl transition-transform duration-300 ease-in-out z-[1000]
          ${isOpen ? "right-0 translate-x-0" : "translate-x-full"}
          ${windowWidth >= 1024 ? "lg:static lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200" : ""}
        `}
        style={{
          width: windowWidth >= 1024 && isCollapsed ? "64px" : "320px",
          right: windowWidth >= 1024 ? "auto" : "0",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div
            className={`flex items-center space-x-3 ${isCollapsed ? "lg:hidden" : ""}`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg gradient-text">Chat do ✨</h2>
              <p className="text-xs text-gray-500">Workspace</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Toggle Button - Desktop only */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapse}
              className="hidden lg:flex hover:bg-gray-100 rounded-lg p-1.5"
              title={isCollapsed ? "Expandir sidebar" : "Minimizar sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              )}
            </Button>

            {/* Close Button - Mobile only */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden hover:bg-gray-100 rounded-lg p-1.5"
              title="Fechar sidebar"
            >
              <X className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Collapsed Logo - Desktop only */}
        {isCollapsed && (
          <div className="hidden lg:flex items-center justify-center p-4 border-b border-gray-100">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
        )}

        {/* Search */}
        {!isCollapsed && (
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-gray-200 focus:border-purple-300 focus:ring-purple-200"
              />
            </div>
          </div>
        )}

        {/* Team Selector */}
        {!isCollapsed && (
          <div className="px-4 mb-4">
            <Button
              variant="ghost"
              className="w-full justify-between p-3 h-auto rounded-xl hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {activeTeam}
                  </p>
                  <p className="text-xs text-gray-500">3 membros online</p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Button>
          </div>
        )}

        {/* Navigation */}
        <nav className="px-4 space-y-2">
          <div className="mb-4">
            {!isCollapsed && (
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Navegação
              </p>
            )}
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={`flex items-center rounded-xl transition-all duration-200 group relative ${
                      isCollapsed
                        ? "justify-center p-3"
                        : "space-x-3 px-3 py-2.5"
                    } ${
                      item.active
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    title={isCollapsed ? item.name : ""}
                  >
                    <IconComponent
                      className={`w-5 h-5 ${
                        item.active ? "text-white" : "text-gray-400"
                      } group-hover:scale-110 transition-transform duration-200`}
                    />
                    {!isCollapsed && (
                      <>
                        <span className="font-medium">{item.name}</span>
                        {item.badge && (
                          <span
                            className={`ml-auto px-2 py-0.5 text-xs font-bold rounded-full ${
                              item.active
                                ? "bg-white/20 text-white"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {item.indicator && (
                          <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        )}
                      </>
                    )}
                    {/* Collapsed indicators */}
                    {isCollapsed && item.badge && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                        {item.badge}
                      </div>
                    )}
                    {isCollapsed && item.indicator && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Actions */}
          {!isCollapsed && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Ações Rápidas
              </p>
              <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <Plus className="w-4 h-4 mr-3" />
                Nova Tarefa
              </Button>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Alertas
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-gray-200 hover:border-green-300 hover:bg-green-50"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Config
                </Button>
              </div>
            </div>
          )}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50">
          {isCollapsed ? (
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white shadow-sm">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  João Silva
                </p>
                <p className="text-xs text-gray-500 truncate">
                  joao@exemplo.com
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-red-500"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
