"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { gradientClasses } from "@/lib/gradient-classes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Edit, Mail, User, MapPin, Phone, Trash2 } from "lucide-react";

interface TeamMemberType {
  _id: Id<"users">;
  name: string;
  email: string;
  joinDate?: number;
  phone?: string;
}

interface EditMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMemberType | null;
  teamId: string;
}

export function EditMemberDialog({
  open,
  onOpenChange,
  member,
  teamId,
}: EditMemberDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // Simulate update member mutation (in real app, this would be implemented in convex/teams.ts)
  const updateMember = useMutation(api.teams.addMember); // Using addMember as placeholder
  const removeMember = useMutation(api.teams.removeMember);

  useEffect(() => {
    if (member) {
      setName(member.name);
      setEmail(member.email);
      setPhone(member.phone || "");
    }
  }, [member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !member) return;

    setIsLoading(true);

    try {
      // In real app, this would be a separate updateMember mutation
      await updateMember({
        teamId,
        email: email.trim(),
      });

      onOpenChange(false);
      console.log("✅ Member updated:", name);
    } catch (error) {
      console.error("Error updating member:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!member) return;

    const confirmed = window.confirm(
      `Are you sure you want to remove ${member.name} from the team? This action cannot be undone.`
    );

    if (confirmed) {
      setIsLoading(true);

      try {
        await removeMember({
          teamId,
          memberId: member._id,
        });

        console.log("🗑️ Member removed:", member.name);
        onOpenChange(false);
      } catch (error) {
        console.error("Error removing member:", error);
        alert("Failed to remove member. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Edit className="w-5 h-5 text-purple-500" />
            <span>Edit Member</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Smith"
                  className="pl-10 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="pl-10 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@company.com"
                className="pl-10 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          {member.joinDate && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border-0 shadow-sm">
              <p className="text-sm text-gray-700">
                <strong>Member since:</strong>{" "}
                {new Date(member.joinDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-purple-200">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemoveMember}
              className="flex items-center space-x-2 border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !name.trim() || !email.trim()}
                className={`${gradientClasses.primaryButton} text-white rounded-xl font-semibold`}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
