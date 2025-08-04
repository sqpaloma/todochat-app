"use client";

import { useState, useEffect, useRef } from "react";
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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const demoSteps = [
    {
      title: "Talk",
      description: "Talk to your team instantly",
      icon: MessageCircle,
      color: "text-blue-500",
      bg: "bg-blue-100",
      animation: "animate-pulse",
      timestamp: 0, // Start of video
    },
    {
      title: "Taskify",
      description: "Transform your conversations into tasks",
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-100",
      animation: "animate-bounce",
      timestamp: 10, // 10 seconds in
    },
    {
      title: "Team Up",
      description: "Send notifications to your team",
      icon: Send,
      color: "text-purple-500",
      bg: "bg-purple-100",
      animation: "animate-ping",
      timestamp: 30, // 30 seconds in
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

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    setIsPlaying(false);

    // Seek to timestamp in YouTube video
    const step = demoSteps[index];
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      const newUrl = `https://www.youtube.com/embed/_6dtNz10cGg?autoplay=1&controls=1&rel=0&modestbranding=1&start=${step.timestamp}`;
      iframe.src = newUrl;
    }
  };

  const currentDemo = demoSteps[currentStep];
  const Icon = currentDemo.icon;

  return (
    <div
      className={`relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-2 shadow-2xl ${className}`}
    >
      <div className="bg-white rounded-3xl p-4">
        <div className="aspect-[16/10] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl relative overflow-hidden">
          {/* YouTube Video Embed */}
          <div className="absolute inset-0">
            <iframe
              ref={iframeRef}
              src="https://www.youtube.com/embed/_6dtNz10cGg?autoplay=0&controls=1&rel=0&modestbranding=1"
              title="TodoChat Demo Video"
              className="w-full h-full rounded-2xl"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">
              {currentDemo.description}
            </span>
            <span className="text-xs text-gray-500">
              {currentStep + 1} / {demoSteps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${((currentStep + 1) / demoSteps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Feature Icons with Timestamps */}
        <div className="mt-3 grid grid-cols-3 gap-2">
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
                onClick={() => handleStepClick(index)}
              >
                <div
                  className={`w-10 h-10 ${step.bg} rounded-lg flex items-center justify-center mx-auto mb-1`}
                >
                  <StepIcon className={`w-5 h-5 ${step.color}`} />
                </div>
                <p className="text-xs text-gray-600 truncate">{step.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
