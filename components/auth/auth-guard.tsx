"use client";

import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Sparkles, MessageSquare, CheckSquare, Users } from "lucide-react";
import { gradientClasses } from "@/lib/gradient-classes";

interface AuthGuardProps {
  children: React.ReactNode;
  pageName?: string;
}

export function AuthGuard({
  children,
  pageName = "this page",
}: AuthGuardProps) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-pink-100/20 to-orange-100/20"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Main Login Card */}
          <div className="w-full max-w-md mx-4">
            <div className="bg-white/90 backdrop-blur-md border border-white/40 rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <div
                  className={`w-12 h-12 ${gradientClasses.primaryBr} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome to Chat Do ✨
                </h2>
                <p className="text-gray-600">Sign in to access {pageName}</p>
              </div>

              {/* Feature Preview */}
              <div className="mb-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                <p className="text-sm font-medium text-gray-700 mb-3 text-center">
                  What you'll get access to:
                </p>
                <div className="flex justify-center space-x-6">
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-xs text-gray-600">Chat</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckSquare className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-xs text-gray-600">Tasks</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-xs text-gray-600">Team</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <SignInButton mode="modal">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Sign In
                  </Button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <Button
                    variant="outline"
                    className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 rounded-2xl py-3 text-base font-semibold transition-all duration-300 hover:border-purple-300"
                  >
                    Create Account
                  </Button>
                </SignUpButton>
              </div>

              {/* Additional Info */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Join thousands of teams who have already discovered the joy of
                  working in an organized and fun way.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
