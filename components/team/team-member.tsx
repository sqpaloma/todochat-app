"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  MoreVertical,
  UserCheck,
  MessageSquare,
  Edit,
} from "lucide-react";

interface TeamMemberType {
  _id: string;
  name: string;
  email: string;
  status?: "online" | "offline";
  role?: string;
  joinDate?: number;
  phone?: string;
  location?: string;
}

interface TeamMemberProps {
  member: TeamMemberType;
  onEdit?: (member: TeamMemberType) => void;
  onViewProfile?: (member: TeamMemberType) => void;
}

export function TeamMember({ member, onEdit, onViewProfile }: TeamMemberProps) {
  const formatJoinDate = (timestamp?: number) => {
    if (!timestamp) return "Date not provided";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "online":
        return "Online";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  return (
    <Card className="group border-0 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-white rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white font-semibold">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-white`}
              ></div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">{member.name}</h3>
              <Badge variant="secondary" className="text-xs">
                {getStatusText(member.status)}
              </Badge>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem
                  className="text-orange-600"
                  onClick={() => onEdit(member)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Member
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-blue-600">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </DropdownMenuItem>
              {onViewProfile && (
                <DropdownMenuItem
                  className="text-green-600"
                  onClick={() => onViewProfile(member)}
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3 text-sm text-gray-600">
          {member.role && (
            <div className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-purple-500" />
              <span>{member.role}</span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-blue-500" />
            <span className="truncate">{member.email}</span>
          </div>

          {member.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-green-500" />
              <span>{member.phone}</span>
            </div>
          )}

          {member.location && (
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>{member.location}</span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span>Joined in {formatJoinDate(member.joinDate)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
