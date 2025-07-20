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
    <div className="group p-6 bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
      <div
        className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className={`w-6 h-6 ${color}`} />
      </div>

      <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
