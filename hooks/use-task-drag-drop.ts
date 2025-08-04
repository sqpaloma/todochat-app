import { useCallback } from "react";
import {
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { Id } from "@/convex/_generated/dataModel";
import { TaskStatus } from "@/types/tasks";

export function useTaskDragDrop(
  onDragStart: (taskId: Id<"tasks">) => void,
  onDragEnd: (taskId: Id<"tasks">, newStatus: TaskStatus) => void
) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      onDragStart(active.id as Id<"tasks">);
    },
    [onDragStart]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) return;

      const taskId = active.id as Id<"tasks">;
      const newStatus = over.id as TaskStatus;

      onDragEnd(taskId, newStatus);
    },
    [onDragEnd]
  );

  return {
    sensors,
    handleDragStart,
    handleDragEnd,
  };
}
