"use client";

import { useState, useEffect } from "react";
import {
  Play,
  Pause,
  MessageCircle,
  CheckCircle,
  Send,
  Users,
  Calendar,
  Zap,
} from "lucide-react";

interface DemoVideoProps {
  className?: string;
}

export function DemoVideo({ className }: DemoVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: "Chat em Tempo Real",
      description: "Converse com sua equipe instantaneamente",
      icon: MessageCircle,
      color: "text-blue-500",
      bg: "bg-blue-100",
      animation: "animate-pulse",
    },
    {
      title: "Transformar em Tarefa",
      description: "Clique e transforme conversas em ações",
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-100",
      animation: "animate-bounce",
    },
    {
      title: "Notificações Inteligentes",
      description: "Receba emails automáticos sobre atualizações",
      icon: Send,
      color: "text-purple-500",
      bg: "bg-purple-100",
      animation: "animate-ping",
    },
    {
      title: "Gestão de Equipe",
      description: "Organize e acompanhe o progresso",
      icon: Users,
      color: "text-orange-500",
      bg: "bg-orange-100",
      animation: "animate-pulse",
    },
  ];

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % demoSteps.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, demoSteps.length]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const currentDemo = demoSteps[currentStep];
  const Icon = currentDemo.icon;

  return (
    <div
      className={`relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-2 shadow-2xl ${className}`}
    >
      <div className="bg-white rounded-3xl p-8">
        <div className="aspect-[16/9] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl relative overflow-hidden">
          {/* Video Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Icon
                  className={`w-16 h-16 ${currentDemo.color.replace("text-", "text-white")}`}
                />
              </div>
              <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                {currentDemo.title}
              </h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                {currentDemo.description}
              </p>
            </div>
          </div>

          {/* Animated Elements */}
          <div className="absolute top-6 left-6">
            <div
              className={`w-16 h-16 ${currentDemo.bg} rounded-xl flex items-center justify-center ${currentDemo.animation}`}
            >
              <MessageCircle className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="absolute top-6 right-6">
            <div
              className={`w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center ${currentDemo.animation}`}
              style={{ animationDelay: "0.5s" }}
            >
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div
              className={`w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center ${currentDemo.animation}`}
              style={{ animationDelay: "1s" }}
            >
              <Send className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-1/4 right-12 animate-float">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
          </div>

          <div
            className="absolute bottom-1/4 left-12 animate-float"
            style={{ animationDelay: "1s" }}
          >
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-pink-600" />
            </div>
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handlePlayPause}
              className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
            >
              {isPlaying ? (
                <Pause className="w-10 h-10 text-gray-700 ml-1" />
              ) : (
                <Play className="w-10 h-10 text-gray-700 ml-1" />
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {currentDemo.title}
            </span>
            <span className="text-xs text-gray-500">
              {currentStep + 1} / {demoSteps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${((currentStep + 1) / demoSteps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Feature Icons */}
        <div className="mt-6 grid grid-cols-4 gap-3">
          {demoSteps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div
                key={index}
                className={`text-center cursor-pointer transition-all duration-300 ${
                  index === currentStep
                    ? "scale-110"
                    : "opacity-60 hover:opacity-100"
                }`}
                onClick={() => {
                  setCurrentStep(index);
                  setIsPlaying(false);
                }}
              >
                <div
                  className={`w-12 h-12 ${step.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}
                >
                  <StepIcon className={`w-6 h-6 ${step.color}`} />
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {step.title.split(" ")[0]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
