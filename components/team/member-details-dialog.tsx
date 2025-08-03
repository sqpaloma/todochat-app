"use client";

import type React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Shield,
  Edit,
} from "lucide-react";

interface TeamMemberType {
  _id: string;
  name: string;
  email: string;
  joinDate?: number;
  phone?: string;
}

interface MemberDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMemberType | null;
  onEdit?: (member: TeamMemberType) => void;
}

export function MemberDetailsDialog({
  open,
  onOpenChange,
  member,
  onEdit,
}: MemberDetailsDialogProps) {
  if (!member) return null;

  const formatJoinDate = (timestamp?: number) => {
    if (!timestamp) return "Date not provided";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const daysSinceJoined = member.joinDate
    ? Math.floor((Date.now() - member.joinDate) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Member Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header do perfil */}
          <div className="flex items-start space-x-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-xl">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {member.name}
              </h2>
              <p className="text-gray-600 mb-2">{member.email}</p>
            </div>
          </div>

          {/* Informações detalhadas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2 text-purple-500" />
                  Personal Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{member.email}</span>
                  </div>

                  {member.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{member.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-purple-500" />
                  Professional Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Member since:</span>
                  </div>
                  <div className="ml-6">
                    <span className="font-medium">
                      {formatJoinDate(member.joinDate)}
                    </span>
                    {daysSinceJoined > 0 && (
                      <p className="text-xs text-gray-500">
                        {daysSinceJoined} day{daysSinceJoined !== 1 ? "s" : ""}{" "}
                        in the team
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                Close
              </Button>
              {onEdit && (
                <Button
                  onClick={() => {
                    onEdit(member);
                    onOpenChange(false);
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
