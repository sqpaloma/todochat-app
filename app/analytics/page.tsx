"use client";

import { EmailStats } from "@/components/email-analytics/email-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Email Analytics
          </h1>
          <p className="text-gray-600">
            Track email performance and engagement across your TodoChat workspace
          </p>
        </div>

        <EmailStats />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                📈 Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-green-800">Best performing email type</span>
                  <span className="text-sm font-semibold text-green-900">Task Notifications</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-blue-800">Peak sending time</span>
                  <span className="text-sm font-semibold text-blue-900">9:00 AM - 11:00 AM</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm text-purple-800">Most active day</span>
                  <span className="text-sm font-semibold text-purple-900">Tuesday</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                🎯 Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <button className="w-full p-3 text-left bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
                  Send Team Announcement
                </button>
                <button className="w-full p-3 text-left bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all">
                  Send Task Reminders
                </button>
                <button className="w-full p-3 text-left bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all">
                  Export Analytics Report
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}