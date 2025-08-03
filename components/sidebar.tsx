"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  CheckSquare,
  Users,
  LogOut,
  BarChart3,
  ChevronDown,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { GradientButton } from "@/components/ui/gradient-button";
import { UserAvatar } from "@/components/ui/user-avatar";

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
import { useResponsive } from "@/hooks/use-responsive";
import { NavigationItem } from "./sidebar/navigation-item";
import { MemberActionsMenu } from "./sidebar/member-actions-menu";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}


export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [activeTeam] = useState("My Team");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [activeMemberMenu, setActiveMemberMenu] = useState<string | null>(null);

  // Use responsive hook
  const { isMobile } = useResponsive();

  // Use the new presence-enabled hook
  const { members: teamMembers } = useTeamMembersWithPresence("team-1");

  // Fetch real tasks count
  const tasks = useQuery(api.tasks.getTasks, { teamId: "team-1" }) || [];
  const taskCount = tasks.length;

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
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      active: pathname === "/analytics",
      gradient: "from-purple-500 to-pink-500",
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
        className={`fixed top-0 bottom-0 bg-white shadow-2xl transition-all duration-300 ease-in-out z-[1000] left-0 lg:static lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200 ${
          isCollapsed ? "lg:w-20" : "w-80 lg:w-80"
        }`}
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          {!isCollapsed ? (
            <Link
              href="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <GradientIcon icon={Sparkles} size="lg" />
              <div>
                <h2 className="font-bold text-lg gradient-text">✨ Chat do</h2>
                <p className="text-xs text-gray-500">Workspace</p>
              </div>
            </Link>
          ) : (
            <Link
              href="/"
              className="hidden lg:flex hover:opacity-80 transition-opacity"
            >
              <GradientIcon icon={Sparkles} size="sm" />
            </Link>
          )}

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

        {!isCollapsed && (
          <div className="px-4 mb-4">
            <Button
              variant="ghost"
              className="w-full justify-between p-3 h-auto rounded-xl hover:bg-gray-50"
              onClick={toggleTeamDropdown}
            >
              <div className="flex items-center space-x-3">
                <GradientIcon icon={Users} size="sm" variant="secondary" />
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
                        <UserAvatar 
                          name={member.name}
                          imageUrl={member.imageUrl}
                          size="md"
                        />
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
                      <MemberActionsMenu
                        memberName={member.name}
                        onAction={handleMemberAction}
                      />
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
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.name}
                {...item}
                isCollapsed={isCollapsed}
              />
            ))}
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
                  <GradientButton size="sm" className="w-full text-xs">
                    Register
                  </GradientButton>
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
                  <GradientButton className="w-full">
                    Create Account
                  </GradientButton>
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
