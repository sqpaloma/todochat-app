"use client";

import { QuickAction } from "./quick-action";
import { Feature } from "./feature";
import {
  CheckSquare,
  MessageSquare,
  Users,
  Zap,
  Mail,
  Calendar,
  Target,
  Sparkles,
  Heart,
  Star,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { gradients } from '@/lib/design-tokens';
import { SocialShare } from '@/components/social/social-share';

export function HomePage() {
  const quickActions = [
    {
      icon: CheckSquare,
      title: "Tasks",
      description: "Organize everything in a fun way",
      href: "/tasks",
      stats: "3 pending",
      gradient: "from-blue-500 to-cyan-400",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      icon: MessageSquare,
      title: "Chat",
      description: "Chat and collaborate in real time",
      href: "/chat",
      stats: "2 online",
      gradient: "from-green-500 to-emerald-400",
      bgGradient: "from-green-50 to-emerald-50",
    },
    {
      icon: Users,
      title: "Team",
      description: "Manage your dream team",
      href: "/team",
      stats: "3 members",
      gradient: "from-orange-500 to-red-400",
      bgGradient: "from-orange-50 to-red-50",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Message → Task",
      description: "Transform conversations into action instantly",
      color: "text-yellow-500",
      bg: "bg-yellow-100",
    },
    {
      icon: Mail,
      title: "Smart Notifications",
      description: "Get automatic updates via email",
      color: "text-purple-500",
      bg: "bg-purple-100",
    },
    {
      icon: Calendar,
      title: "Magic Calendar",
      description: "Visualize deadlines intuitively",
      color: "text-pink-500",
      bg: "bg-pink-100",
    },
    {
      icon: Target,
      title: "Productivity++",
      description: "Track results in real time",
      color: "text-indigo-500",
      bg: "bg-indigo-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 pt-8 sm:pt-12 lg:pt-0">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs sm:text-sm font-semibold mb-6 sm:mb-8 border border-purple-200">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            About Chat Do
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 ml-2 text-pink-500" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight px-4">
            Where conversations become
            <br className="hidden sm:block" />
            <span className="block sm:inline">
              <span className="gradient-text">incredible results</span>
              <div className="inline-block ml-2 sm:ml-4 float-animation">
                <Star className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-yellow-400 fill-current" />
              </div>
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed font-medium px-4">
            <strong className="gradient-text">Chat Do</strong> is the most fun
            tool to transform your conversations into organized tasks. Your team
            will love gamified productivity! 🚀
          </p>

          <div className="flex justify-center px-4">
            <Button
              onClick={() => (window.location.href = "/tasks")}
              className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 ${gradients.primaryButton} text-white rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105`}
            >
              Start the Fun
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 sm:mb-4 px-4">
            Explore the <span className="gradient-text">features</span>
          </h2>
          <p className="text-center text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto font-medium px-4">
            Quickly access everything you need to keep your team productive and
            happy
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {quickActions.map((action, index) => (
              <QuickAction key={index} {...action} />
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 sm:mb-4 px-4">
            Features that will{" "}
            <span className="gradient-text">surprise you</span>
          </h2>
          <p className="text-center text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto font-medium px-4">
            Features designed to make teamwork more efficient and fun
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <Feature key={index} {...feature} />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center px-4 pb-8 sm:pb-12">
          <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Ready to start the{" "}
              <span className="gradient-text">revolution</span>?
            </h3>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join thousands of teams who have already discovered the joy of
              working in an organized and fun way.
            </p>
            <Button
              onClick={() => (window.location.href = "/tasks")}
              className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 ${gradients.primaryButton} text-white rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105`}
            >
              Let's get started! ✨
            </Button>
          </div>
        </div>

        {/* Social Sharing */}
        <div className="px-4 pb-8 sm:pb-12">
          <div className="max-w-md mx-auto">
            <SocialShare />
          </div>
        </div>
      </div>
    </div>
  );
}
