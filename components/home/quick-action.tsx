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
      className={`group border-0 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br ${bgGradient} rounded-3xl overflow-hidden`}
    >
      <CardContent className="p-8 text-center">
        <div
          className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>

        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-gray-500">{stats}</span>
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
              />
            ))}
          </div>
        </div>

        <Link href={href}>
          <Button
            className={`w-full bg-gradient-to-r ${gradient} hover:opacity-90 text-white rounded-2xl font-semibold py-3 transition-all duration-300 group-hover:shadow-lg`}
          >
            Acessar
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
