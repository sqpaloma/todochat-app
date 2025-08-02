"use client";

import type React from "react";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, User, CheckCircle, AlertCircle } from "lucide-react";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
}

interface FormState {
  name: string;
  email: string;
}

interface MessageState {
  type: "success" | "error";
  text: string;
}

export function AddMemberDialog({
  open,
  onOpenChange,
  teamId,
}: AddMemberDialogProps) {
  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<MessageState | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const addMember = useMutation(api.teams.addMember);

  // Cleanup timeout on unmount or when dialog closes
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormState({ name: "", email: "" });
      setMessage(null);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [open]);

  // Memoized form validation
  const isFormValid = useMemo(() => {
    return formState.name.trim() && formState.email.trim();
  }, [formState.name, formState.email]);

  // Memoized input handlers to prevent unnecessary re-renders
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, name: e.target.value }));
    },
    []
  );

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, email: e.target.value }));
    },
    []
  );

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const resetForm = useCallback(() => {
    setFormState({ name: "", email: "" });
    setMessage(null);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isFormValid) return;

      setIsLoading(true);
      setMessage(null);

      try {
        const result = await addMember({
          teamId,
          email: formState.email.trim(),
        });

        if (result.success) {
          setMessage({ type: "success", text: result.message });

          // Clear previous timeout if exists
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          // Reset form after showing success message
          timeoutRef.current = setTimeout(() => {
            resetForm();
            onOpenChange(false);
          }, 2000);
        } else {
          setMessage({ type: "error", text: result.message });
        }
      } catch (error) {
        console.error("Error sending invitation:", error);
        setMessage({
          type: "error",
          text: "Failed to send invitation. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [addMember, teamId, formState.email, isFormValid, onOpenChange, resetForm]
  );

  // Memoized message component to prevent unnecessary re-renders
  const messageComponent = useMemo(() => {
    if (!message) return null;

    const isSuccess = message.type === "success";
    const bgColor = isSuccess
      ? "bg-green-50 text-green-700"
      : "bg-red-50 text-red-700";
    const Icon = isSuccess ? CheckCircle : AlertCircle;

    return (
      <div className={`p-3 rounded-lg flex items-center space-x-2 ${bgColor}`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm">{message.text}</span>
      </div>
    );
  }, [message]);

  // Memoized info box to prevent unnecessary re-renders
  const infoBox = useMemo(
    () => (
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">📧 Email Invitation</h4>
        <p className="text-sm text-blue-700">
          An invitation will be sent automatically to the provided email with
          instructions to join the team.
        </p>
      </div>
    ),
    []
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-blue-500" />
            <span>Send Team Invitation</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="name"
                value={formState.name}
                onChange={handleNameChange}
                placeholder="e.g. John Smith"
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={formState.email}
                onChange={handleEmailChange}
                placeholder="john@company.com"
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {messageComponent}

          {infoBox}

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !isFormValid}>
              {isLoading ? "Sending Invitation..." : "Send Invitation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
