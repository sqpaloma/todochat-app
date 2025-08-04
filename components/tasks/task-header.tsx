"use client";

import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import { gradientClasses } from "@/lib/gradient-classes";

interface TaskHeaderProps {
  showCalendar: boolean;
  onToggleCalendar: () => void;
  onAddTask: () => void;
}

export function TaskHeader({
  showCalendar,
  onToggleCalendar,
  onAddTask,
}: TaskHeaderProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 flex-shrink-0">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Title */}
          <div className="flex items-center gap-4">
            <div className="ml-12">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Task Board
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Organize and track task progress
              </p>
            </div>
          </div>

          {/* Right side - Action Buttons */}
          <div className="flex flex-col lg:flex-row gap-3">
            <Button
              onClick={onAddTask}
              className={`${gradientClasses.primaryButton} text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200`}
              aria-label="Add new task"
            >
              <Plus className="w-4 h-4 mr-2" />
              Task
            </Button>

            {/* Calendar Toggle - Mobile and Medium */}
            <Button
              onClick={onToggleCalendar}
              className={`lg:hidden ${gradientClasses.primaryButton} text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 min-w-[120px]`}
              aria-label={showCalendar ? "Hide calendar" : "Show calendar"}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {showCalendar ? "Hide" : "Show"}
            </Button>

            {/* Calendar Toggle - Desktop */}
            <Button
              onClick={onToggleCalendar}
              className={`hidden lg:flex ${gradientClasses.primaryButton} text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200`}
              aria-label={showCalendar ? "Hide calendar" : "Show calendar"}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {showCalendar ? "Hide Calendar" : "Show Calendar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
