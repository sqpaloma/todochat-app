"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

interface TaskCalendarProps {
  tasks: Array<{
    _id: string;
    title: string;
    dueDate?: number;
    status: "todo" | "in-progress" | "done";
  }>;
}

export function TaskCalendar({ tasks }: TaskCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  const overdueTasks = tasks.filter(
    (task) =>
      task.dueDate && task.dueDate < Date.now() && task.status !== "done"
  ).length;

  const tasksByDate = tasks.reduce(
    (acc, task) => {
      if (task.dueDate) {
        const taskDate = new Date(task.dueDate);
        if (taskDate.getFullYear() === year && taskDate.getMonth() === month) {
          const day = taskDate.getDate();
          if (!acc[day]) acc[day] = [];
          acc[day].push(task);
        }
      }
      return acc;
    },
    {} as Record<number, typeof tasks>
  );

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDayStyle = (day: number) => {
    const dayTasks = tasksByDate[day] || [];
    const hasOverdue = dayTasks.some(
      (task) =>
        task.dueDate && task.dueDate < Date.now() && task.status !== "done"
    );
    const hasFuture = dayTasks.some(
      (task) => task.dueDate && task.dueDate >= Date.now()
    );
    const isToday = isCurrentMonth && day === todayDate;

    if (isToday) {
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    } else if (hasOverdue) {
      return "bg-red-50 text-red-700 border-red-100";
    } else if (hasFuture) {
      return "bg-green-50 text-green-700 border-green-100";
    }
    return "bg-white text-gray-600 border-gray-100";
  };

  const getDotColor = (day: number) => {
    const dayTasks = tasksByDate[day] || [];
    const hasOverdue = dayTasks.some(
      (task) =>
        task.dueDate && task.dueDate < Date.now() && task.status !== "done"
    );
    const hasFuture = dayTasks.some(
      (task) => task.dueDate && task.dueDate >= Date.now()
    );
    const isToday = isCurrentMonth && day === todayDate;

    if (isToday) {
      return "bg-indigo-500";
    } else if (hasOverdue) {
      return "bg-red-500";
    } else if (hasFuture) {
      return "bg-green-500";
    }
    return null;
  };

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="flex items-center space-x-2 text-lg font-semibold">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <span>Schedule</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-gray-200 bg-transparent"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {overdueTasks > 0 && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-700 font-medium">
              {overdueTasks} overdue task{overdueTasks > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth("prev")}
            className="rounded-full"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-lg font-semibold text-gray-900">
            {monthNames[month]} {year}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth("next")}
            className="rounded-full"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`
                aspect-square flex flex-col items-center justify-center text-sm font-medium border rounded-lg relative transition-all
                ${day ? getDayStyle(day) : "bg-transparent border-transparent"}
                ${day ? "hover:shadow-sm cursor-pointer" : ""}
              `}
            >
              {day && (
                <>
                  <span>{day}</span>
                  {getDotColor(day) && (
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${getDotColor(day)} absolute bottom-1`}
                    />
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center space-x-4 mt-6 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span>Overdue</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>Today</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Future</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
