"use client";

import type React from "react";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TeamMember {
  _id: string;
  name: string;
  email: string;
}

interface CreateManualTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamMembers: TeamMember[];
  teamId: string;
}

export function CreateManualTaskDialog({
  open,
  onOpenChange,
  teamMembers,
  teamId,
}: CreateManualTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [isLoading, setIsLoading] = useState(false);

  const createTask = useMutation(api.tasks.createTask);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !assigneeId || !dueDate) return;

    setIsLoading(true);

    try {
      const assignee = teamMembers.find((member) => member._id === assigneeId);

      await createTask({
        title: title.trim(),
        description: description.trim(),
        assigneeId,
        assigneeName: assignee?.name || "",
        assigneeEmail: assignee?.email || "",
        teamId,
        createdBy: "user-1", // In real app, get from auth
        dueDate: dueDate?.getTime(),
        priority,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setAssigneeId("");
      setDueDate(undefined);
      setPriority("medium");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const priorityColors = {
    low: "text-green-600 bg-green-50",
    medium: "text-yellow-600 bg-yellow-50",
    high: "text-red-600 bg-red-50",
  };

  const priorityLabels = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-blue-500" />
            <span>New Task</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Review commercial proposal..."
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe task details, objectives and acceptance criteria..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Assignee *</Label>
              <Select value={assigneeId} onValueChange={setAssigneeId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member._id} value={member._id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Priority *</Label>
              <Select
                value={priority}
                onValueChange={(value: "low" | "medium" | "high") =>
                  setPriority(value)
                }
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors.low}`}
                    >
                      🟢 Low
                    </span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors.medium}`}
                    >
                      🟡 Medium
                    </span>
                  </SelectItem>
                  <SelectItem value="high">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors.high}`}
                    >
                      🔴 High
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Due Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-transparent"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate
                    ? format(dueDate, "PPP", { locale: ptBR })
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !title.trim() || !assigneeId || !dueDate}
            >
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
