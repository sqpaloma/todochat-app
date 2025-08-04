"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import {
  LogOut,
  ChevronDown,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { gradients } from "@/lib/design-tokens";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  SignOutButton,
} from "@clerk/nextjs";
import { useTeamPresence } from "@/hooks/use-team-presence";
import { useResponsiveSSR } from "@/hooks/use-responsive-ssr";
import { UserAvatar } from "@/components/ui/user-avatar";
import { NavigationSection } from "./navigation-section";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Simplified Team Member Item
function TeamMember({
  member,
  onAction,
}: {
  member: any;
  onAction: (action: string, memberName: string) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  const actions = [
    { key: "Add Task", label: "Add Task" },
    { key: "Send Message", label: "Send Message" },
    { key: "Edit", label: "Edit" },
  ];

  return (
    <div className="relative">
      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 group">
        <div className="flex items-center space-x-3">
          <UserAvatar name={member.name} imageUrl={member.imageUrl} size="md" />
          <div>
            <p className="text-sm font-medium text-gray-900">{member.name}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
          onClick={() => setShowMenu(!showMenu)}
        >
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </Button>
      </div>

      {showMenu && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {actions.map(({ key, label }) => (
            <button
              key={key}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => {
                onAction(key, member.name);
                setShowMenu(false);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Main Sidebar component
export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const { isMobile } = useResponsiveSSR();
  const { members: teamMembers } = useTeamPresence("team-1", null);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) onClose();
  }, [isMobile, onClose]);

  // Prevent body scroll on mobile
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, isMobile]);

  const handleMemberAction = (action: string, memberName: string) => {
    console.log(`${action} for ${memberName}`);
  };

  return (
    <>
      {/* Mobile backdrop */}
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
        style={{ transform: isOpen ? "translateX(0)" : "translateX(-100%)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          {!isCollapsed ? (
            <Link
              href="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div
                className={`w-12 h-12 ${gradients.primaryBr} rounded-xl flex items-center justify-center`}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </div>
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
              <div
                className={`w-8 h-8 ${gradients.primaryBr} rounded-lg flex items-center justify-center`}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </Link>
          )}

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex hover:bg-gray-100 rounded-lg p-1.5"
              title={isCollapsed ? "Expand sidebar" : "Minimize sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              )}
            </Button>
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

        {/* Team Section */}
        {!isCollapsed && (
          <div className="px-4 mb-4">
            <Button
              variant="ghost"
              className="w-full justify-between p-3 h-auto rounded-xl hover:bg-gray-50"
              onClick={() => setShowTeamDropdown(!showTeamDropdown)}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 ${gradients.secondary} rounded-lg flex items-center justify-center`}
                >
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">My Team</p>
                  <p className="text-xs text-gray-500">
                    {teamMembers.length} members
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showTeamDropdown ? "rotate-180" : ""}`}
              />
            </Button>

            {showTeamDropdown && (
              <div className="mt-2 space-y-1">
                {teamMembers.map((member) => (
                  <TeamMember
                    key={member._id}
                    member={member}
                    onAction={handleMemberAction}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <NavigationSection isCollapsed={isCollapsed} />

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
                  <Button
                    size="sm"
                    className={`w-full text-xs ${gradients.primaryButton} text-white border-0`}
                  >
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
                  <Button
                    className={`w-full ${gradients.primaryButton} text-white border-0`}
                  >
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
                  appearance={{ elements: { avatarBox: "w-10 h-10" } }}
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
