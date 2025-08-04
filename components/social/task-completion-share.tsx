"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, X, Sparkles, Target } from "lucide-react";
import { gradientClasses } from "@/lib/gradient-classes";

interface TaskCompletionShareProps {
  taskTitle: string;
  isVisible: boolean;
  onClose: () => void;
}

export function TaskCompletionShare({
  taskTitle,
  isVisible,
  onClose,
}: TaskCompletionShareProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      // Auto hide after 10 seconds
      const timer = setTimeout(() => {
        setShow(false);
        onClose();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!show) return null;

  const shareText = `🎉 Just completed "${taskTitle}" using Chat Do ✨ - the most fun way to stay productive! Transform your conversations into organized tasks. #ChatDo #Productivity #TaskComplete #TeamWork`;

  const handleShare = () => {
    const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <Card className="w-80 border-0 shadow-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 ${gradientClasses.primaryBr} rounded-lg flex items-center justify-center mr-3`}
              >
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-green-800 text-sm">
                  Task Complete! 🎉
                </h4>
                <p className="text-green-600 text-xs">
                  Great job finishing that task!
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>

          <div className="bg-white/50 backdrop-blur-sm border border-green-100 rounded-lg p-3 mb-3">
            <div className="flex items-center mb-2">
              <Target className="w-4 h-4 text-green-500 mr-2" />
              <p className="text-sm font-medium text-gray-800 truncate">
                {taskTitle}
              </p>
            </div>
            <p className="text-xs text-gray-600">
              Share your productivity win with the world!
            </p>
          </div>

          <Button
            onClick={handleShare}
            className="w-full bg-[#1DA1F2] hover:bg-[#1a91da] text-white text-sm"
          >
            <X className="w-4 h-4 mr-2" />
            Share on X
            <Sparkles className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
