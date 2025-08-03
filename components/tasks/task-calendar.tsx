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
      return "bg-blue-100 text-blue-700";
    } else if (hasOverdue) {
      return "bg-red-100 text-red-700";
    } else if (hasFuture) {
      return "bg-green-100 text-green-700";
    }
    return "bg-white text-gray-600";
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
      return "bg-blue-500";
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
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-1">
          <CardTitle className="flex items-center space-x-2 text-base font-semibold">
            <Calendar className="w-4 h-4 text-purple-600" />
            <span>Schedule</span>
          </CardTitle>
          {overdueTasks > 0 && (
            <div className="flex items-center space-x-0">
              <div className="flex items-center justify-center w-5 h-5 bg-red-100 rounded-full">
                <AlertTriangle className="w-3 h-3 text-red-600" />
              </div>
              <span className="text-xs font-medium text-red-700">
                {overdueTasks}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth("prev")}
            className="rounded-full h-7 w-7 p-0"
          >
            <ChevronLeft className="w-3 h-3" />
          </Button>
          <h3 className="text-base font-semibold text-gray-900">
            {monthNames[month]} {year}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth("next")}
            className="rounded-full h-7 w-7 p-0"
          >
            <ChevronRight className="w-3 h-3" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500 py-0.5"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`
                aspect-square flex items-center justify-center text-xs font-medium rounded-md transition-all
                ${day ? getDayStyle(day) : "bg-transparent"}
                ${day ? "hover:shadow-sm cursor-pointer" : ""}
              `}
            >
              {day && <span>{day}</span>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
