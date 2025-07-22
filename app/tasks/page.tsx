"use client";

import { TasksPage } from "@/components/tasks/tasks-page";
import { SidebarLayout } from "@/components/sidebar-layout";

export default function Tasks() {
  return (
    <SidebarLayout activeView="tasks">
      <TasksPage />
    </SidebarLayout>
  );
}
