"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Facebook,
  Linkedin,
  Instagram,
  Copy,
  Check,
  Heart,
  Sparkles,
  Github,
  Mail,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface SocialShareProps {
  title?: string;
  description?: string;
  url?: string;
  hashtags?: string[];
}

function SocialShare({
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
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(fullText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(fullText)}`,
    instagram: `#`,
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
    if (platform === "instagram") {
      // Instagram doesn't support direct sharing via URL, so we copy the text
      handleCopyLink();
    } else {
      window.open(shareLinks[platform], "_blank", "width=600,height=400");
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm border border-purple-100 rounded-lg p-3 sm:p-4">
      <div className="text-center mb-3">
        <div className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs font-semibold mb-2 border border-purple-200">
          <Heart className="w-3 h-3 mr-1.5 text-pink-500" />
          Love Chat Do?
          <Sparkles className="w-3 h-3 ml-1.5" />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1.5">
          Share the <span className="gradient-text">magic</span>!
        </h3>
        <p className="text-gray-600 text-xs leading-relaxed">
          Help others discover the joy of organized productivity
        </p>
      </div>

      <div className="space-y-2.5">
        {/* Social Media Buttons */}
        <div className="flex justify-center gap-2">
          <Button
            onClick={() => handleShare("x")}
            size="sm"
            variant="outline"
            className="w-10 h-10 p-0 border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400"
          >
            <X className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => handleShare("facebook")}
            size="sm"
            variant="outline"
            className="w-10 h-10 p-0 border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400"
          >
            <Facebook className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => handleShare("linkedin")}
            size="sm"
            variant="outline"
            className="w-10 h-10 p-0 border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400"
          >
            <Linkedin className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => handleShare("instagram")}
            size="sm"
            variant="outline"
            className="w-10 h-10 p-0 border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400"
          >
            <Instagram className="w-4 h-4" />
          </Button>
        </div>

        {/* Copy Link Button */}
        <Button
          onClick={handleCopyLink}
          variant="outline"
          size="sm"
          className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 h-8 text-xs"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 mr-1.5 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 mr-1.5" />
              Copy share text
            </>
          )}
        </Button>

        {/* Preview - Hidden for now */}
        {/* <div className="bg-white/70 backdrop-blur-sm border border-purple-100 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-2">Preview:</p>
          <div className="text-xs text-gray-700 space-y-1">
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
        </div> */}
      </div>
    </div>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 border-t border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Company Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                Chat Do
              </span>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              Transform your team conversations into organized tasks with our
              amazing productivity tool.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Github className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                href="mailto:hello@chatdo.app"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Product
            </h3>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/chat"
                  className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm transition-colors"
                >
                  Chat
                </Link>
              </li>
              <li>
                <Link
                  href="/tasks"
                  className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm transition-colors"
                >
                  Tasks
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm transition-colors"
                >
                  Team
                </Link>
              </li>
              <li>
                <Link
                  href="/notifications"
                  className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm transition-colors"
                >
                  Notifications
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Share */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Share
            </h3>
            <SocialShare />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-purple-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <p className="text-gray-600 text-xs sm:text-sm">
              © {currentYear} Chat Do. All rights reserved.
            </p>
            <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-600">
              <span>Built with</span>
              <Link
                href="https://convex.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors"
              >
                <span>Convex</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              <span>and</span>
              <Link
                href="https://resend.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors"
              >
                <span>Resend</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
