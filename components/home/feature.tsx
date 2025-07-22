"use client";

import { type LucideIcon } from "lucide-react";

interface FeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bg: string;
}

export function Feature({
  icon: Icon,
  title,
  description,
  color,
  bg,
}: FeatureProps) {
  return (
    <div className="group p-4 sm:p-6 bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl sm:rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 ${bg} rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
      </div>

      <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h4>
      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
