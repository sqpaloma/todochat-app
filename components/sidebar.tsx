"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  CheckSquare,
  Users,
  LogOut,
  Plus,
  ChevronDown,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Edit,
  Send,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  SignOutButton,
} from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTeamMembersWithPresence } from "@/hooks/use-team-members-with-presence";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  joinDate: number;
  phone?: string;
  imageUrl?: string;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTeam, setActiveTeam] = useState("My Team");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [activeMemberMenu, setActiveMemberMenu] = useState<string | null>(null);

  // Use the new presence-enabled hook
  const { members: teamMembers, stats } = useTeamMembersWithPresence("team-1");

  // Fetch real tasks count
  const tasks = useQuery(api.tasks.getTasks, { teamId: "team-1" }) || [];
  const taskCount = tasks.length;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Helper function to check if we're on mobile
  const isMobile = windowWidth > 0 && windowWidth < 1024;

  // Fecha a sidebar no mobile apenas quando a rota mudar
  useEffect(() => {
    if (isMobile) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isMobile]);

  // Close sidebar when window is resized to desktop
  useEffect(() => {
    if (!isMobile && !isOpen) {
      // Auto-open sidebar on desktop if it was closed
      // This is optional - you can remove this if you want sidebar to stay closed
    }
  }, [isMobile, isOpen]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleTeamDropdown = () => {
    setShowTeamDropdown(!showTeamDropdown);
    setActiveMemberMenu(null); // Close any open member menu
  };

  const toggleMemberMenu = (memberId: string) => {
    setActiveMemberMenu(activeMemberMenu === memberId ? null : memberId);
  };

  const handleMemberAction = (action: string, memberName: string) => {
    console.log(`${action} for ${memberName}`);
    setActiveMemberMenu(null);
    // Here you can implement the actual actions
  };

  const navigationItems = [
    {
      name: "Tasks",
      href: "/tasks",
      icon: CheckSquare,
      active: pathname === "/tasks",
      gradient: "from-blue-500 to-cyan-500",
      badge: taskCount > 0 ? taskCount.toString() : undefined,
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
      name: "Team",
      href: "/team",
      icon: Users,
      active: pathname === "/team",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[999] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className="fixed top-0 bottom-0 bg-white shadow-2xl transition-transform duration-300 ease-in-out z-[1000] w-80 left-0 lg:static lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <Link
            href="/"
            className={`flex items-center space-x-3 hover:opacity-80 transition-opacity ${isCollapsed ? "lg:hidden" : ""}`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg gradient-text">✨ Chat do</h2>
              <p className="text-xs text-gray-500">Workspace</p>
            </div>
          </Link>

          <div className="flex items-center space-x-2">
            {/* Toggle Button - Desktop only */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapse}
              className="hidden lg:flex hover:bg-gray-100 rounded-lg p-1.5"
              title={isCollapsed ? "Expand sidebar" : "Minimize sidebar"}
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
              title="Close sidebar"
            >
              <X className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Collapsed Logo - Desktop only */}
        {isCollapsed && (
          <div className="hidden lg:flex items-center justify-center p-4 border-b border-gray-100">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </Link>
          </div>
        )}

        {!isCollapsed && (
          <div className="px-4 mb-4">
            <Button
              variant="ghost"
              className="w-full justify-between p-3 h-auto rounded-xl hover:bg-gray-50"
              onClick={toggleTeamDropdown}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {activeTeam}
                  </p>
                  <p className="text-xs text-gray-500">
                    {teamMembers.length} members
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showTeamDropdown ? "rotate-180" : ""}`}
              />
            </Button>

            {/* Team Members Dropdown */}
            {showTeamDropdown && (
              <div className="mt-2 space-y-1">
                {teamMembers.map((member) => (
                  <div key={member._id} className="relative">
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 group">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          {member.imageUrl ? (
                            <img
                              src={member.imageUrl}
                              alt={member.name}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {member.name}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        onClick={() => toggleMemberMenu(member._id)}
                      >
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </Button>
                    </div>

                    {/* Member Actions Menu */}
                    {activeMemberMenu === member._id && (
                      <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <button
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                          onClick={() =>
                            handleMemberAction("Add Task", member.name)
                          }
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Task</span>
                        </button>
                        <button
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                          onClick={() =>
                            handleMemberAction("Send Message", member.name)
                          }
                        >
                          <Send className="w-4 h-4" />
                          <span>Send Message</span>
                        </button>
                        <button
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                          onClick={() =>
                            handleMemberAction("Edit", member.name)
                          }
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="px-4 space-y-2">
          <div className="mb-4">
            {!isCollapsed && (
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Navigation
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
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50">
          <SignedOut>
            {isCollapsed ? (
              <div className="flex flex-col space-y-2">
                <SignInButton>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                  >
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs">
                    Register
                  </Button>
                </SignUpButton>
              </div>
            ) : (
              <div className="space-y-2">
                <SignInButton>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    Create Account
                  </Button>
                </SignUpButton>
              </div>
            )}
          </SignedOut>

          <SignedIn>
            {isCollapsed ? (
              <div className="flex flex-col items-center space-y-2">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    },
                  }}
                />
                <SignOutButton>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-red-500 p-1"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </SignOutButton>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-xl bg-white shadow-sm">
                <UserButton
                  showName={true}
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-10 h-10",
                      userButtonBox: "flex-row-reverse",
                    },
                  }}
                />
                <SignOutButton>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-red-500"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </SignOutButton>
              </div>
            )}
          </SignedIn>
        </div>
      </div>
    </>
  );
}
