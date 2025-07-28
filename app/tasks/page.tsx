"use client";

import { TasksPage } from "@/components/tasks/tasks-page";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function Tasks() {
  return (
    <AuthGuard pageName="Tasks">
      <TasksPage />
    </AuthGuard>
  );
}
