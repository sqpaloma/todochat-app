"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

interface QuickActionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  stats: string;
  gradient: string;
  bgGradient: string;
}

export function QuickAction({
  icon: Icon,
  title,
  description,
  href,
  stats,
  gradient,
  bgGradient,
}: QuickActionProps) {
  return (
    <Card
      className={`group border-0 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br ${bgGradient} rounded-2xl sm:rounded-3xl overflow-hidden`}
    >
      <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
          {description}
        </p>

        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <span className="text-xs sm:text-sm text-gray-500">{stats}</span>
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
              />
            ))}
          </div>
        </div>

        <Link href={href}>
          <Button
            className={`w-full bg-gradient-to-r ${gradient} hover:opacity-90 text-white rounded-xl sm:rounded-2xl font-semibold py-2.5 sm:py-3 text-sm sm:text-base transition-all duration-300 group-hover:shadow-lg`}
          >
            Acessar
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
