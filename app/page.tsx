"use client";

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
import { Card, CardContent } from "@/components/ui/card";
import { gradients } from "@/lib/design-tokens";
import { SocialShare } from "@/components/social/social-share";
import { DemoVideo } from "@/components/demo/demo-video";
import Link from "next/link";

export default function App() {
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
    <div className="min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Hero Section with Video Side by Side */}
        <div className="mb-16 lg:mb-24 pt-2 sm:pt-4 lg:pt-0">
          <div className="w-full max-w-none">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center">
              {/* Text Content */}
              <div className="text-center xl:text-left px-8 lg:px-16 xl:px-12">
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-base font-semibold mb-12 border border-blue-200">
                  <Sparkles className="w-5 h-5 mr-3" />
                  About Chat Do
                  <Heart className="w-5 h-5 ml-3 text-pink-500" />
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-12 leading-tight">
                  Pass tasks to <br /> others and let
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    email handle the rest
                  </span>
                  <div className="inline-block ml-6 float-animation">
                    <Star className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-yellow-400 fill-current" />
                  </div>
                </h1>

                <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-16 leading-relaxed font-medium">
                  <strong className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Chat Do
                  </strong>{" "}
                  sends tasks through messages at school, college, or work, and
                  email will keep nudging until the task is done! 🚀
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center xl:justify-start">
                  <Button
                    onClick={() => (window.location.href = "/tasks")}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Start building
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Video Demo */}
              <div className="px-8 lg:px-16 xl:px-8">
                <DemoVideo />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 sm:mb-4 px-4">
            Explore the{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              features
            </span>
          </h2>
          <p className="text-center text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto font-medium px-4">
            Quickly access everything you need to keep your team productive and
            happy
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card
                  key={index}
                  className={`group border-0 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br ${action.bgGradient} rounded-2xl sm:rounded-3xl overflow-hidden`}
                >
                  <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${action.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                      {action.description}
                    </p>

                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <span className="text-xs sm:text-sm text-gray-500">
                        {action.stats}
                      </span>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                          />
                        ))}
                      </div>
                    </div>

                    <Link href={action.href}>
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl sm:rounded-2xl font-semibold py-2.5 sm:py-3 text-sm sm:text-base transition-all duration-300 group-hover:shadow-lg">
                        Acessar
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Features */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 sm:mb-4 px-4">
            Features that will{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              surprise you
            </span>
          </h2>
          <p className="text-center text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto font-medium px-4">
            Features designed to make teamwork more efficient and fun
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-4 sm:p-6 bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl sm:rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 ${feature.bg} rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${feature.color}`}
                    />
                  </div>

                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center px-4 pb-8 sm:pb-12">
          <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Ready to start the{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                revolution
              </span>
              ?
            </h3>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join thousands of teams who have already discovered the joy of
              working in an organized and fun way.
            </p>
            <Button
              onClick={() => (window.location.href = "/tasks")}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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
