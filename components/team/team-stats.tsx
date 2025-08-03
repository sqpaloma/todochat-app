"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { TeamStats } from "@/types/team";
import { Users, UserCheck, Clock, TrendingUp } from "lucide-react";

interface TeamStatsProps {
  stats: TeamStats;
}

export function TeamStats({ stats }: TeamStatsProps) {
  const statCards = [
    {
      icon: Users,
      label: "Total Members",
      value: stats.total,
      color: "purple",
    },
    {
      icon: UserCheck,
      label: "Online",
      value: stats.online,
      color: "green",
    },
    {
      icon: Clock,
      label: "Offline",
      value: stats.offline,
      color: "gray",
    },
    {
      icon: TrendingUp,
      label: "Activity Rate",
      value: `${stats.onlinePercentage}%`,
      color: "blue",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        const colorClasses = {
          purple: "bg-purple-100 text-purple-600",
          green: "bg-green-100 text-green-600",
          gray: "bg-gray-100 text-gray-600",
          blue: "bg-blue-100 text-blue-600",
        };

        return (
          <Card
            key={card.label}
            className="transition-all duration-200 hover:shadow-md border-purple-200"
          >
            <CardContent className="p-4 flex items-center space-x-3">
              <div
                className={`p-2 rounded-lg ${colorClasses[card.color as keyof typeof colorClasses]}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
