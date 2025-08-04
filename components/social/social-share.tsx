"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Facebook,
  Linkedin,
  Copy,
  Check,
  Heart,
  Sparkles,
} from "lucide-react";

interface SocialShareProps {
  title?: string;
  description?: string;
  url?: string;
  hashtags?: string[];
}

export function SocialShare({
  title = "I'm using Chat Do ✨ - The most fun way to turn conversations into tasks!",
  description = "Transform your team conversations into organized tasks with this amazing productivity tool. #productivity #teamwork #chatdo",
  url = "https://chatdo.app",
  hashtags = ["ChatDo", "Productivity", "TeamWork", "Convex", "Resend"],
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `${title}\n\n${description}`;
  const hashtagsString = hashtags.map((tag) => `#${tag}`).join(" ");
  const fullText = `${shareText}\n\n${hashtagsString}\n\n${url}`;

  const shareLinks = {
    x: `https://x.com/intent/tweet?text=${encodeURIComponent(fullText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "width=600,height=400");
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-semibold mb-3 border border-purple-200">
            <Heart className="w-4 h-4 mr-2 text-pink-500" />
            Love Chat Do?
            <Sparkles className="w-4 h-4 ml-2" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Share the <span className="gradient-text">magic</span>!
          </h3>
          <p className="text-gray-600 text-sm">
            Help others discover the joy of organized productivity
          </p>
        </div>

        <div className="space-y-4">
          {/* Social Media Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => handleShare("x")}
              className="flex-1 bg-[#1DA1F2] hover:bg-[#1a91da] text-white"
            >
              <X className="w-4 h-4 mr-2" />X
            </Button>
            <Button
              onClick={() => handleShare("facebook")}
              className="flex-1 bg-[#1877F2] hover:bg-[#166fe5] text-white"
            >
              <Facebook className="w-4 h-4 mr-2" />
              Facebook
            </Button>
            <Button
              onClick={() => handleShare("linkedin")}
              className="flex-1 bg-[#0A66C2] hover:bg-[#095bb5] text-white"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </Button>
          </div>

          {/* Copy Link Button */}
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy share text
              </>
            )}
          </Button>

          {/* Preview */}
          <div className="bg-white/50 backdrop-blur-sm border border-purple-100 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-2">Preview:</p>
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-semibold">{title}</p>
              <p>{description}</p>
              <div className="flex flex-wrap gap-1">
                {hashtags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs bg-purple-100 text-purple-700"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
              <p className="text-purple-600 font-medium">{url}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
