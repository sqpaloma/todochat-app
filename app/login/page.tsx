"use client";

import { AuthGuard } from "@/components/auth/auth-guard";

export default function LoginPage() {
  return (
    <AuthGuard pageName="Tasks">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Redirecting to Tasks...
          </h1>
          <p className="text-gray-600">
            You are already signed in. Redirecting to your tasks.
          </p>
        </div>
      </div>
    </AuthGuard>
  );
}
