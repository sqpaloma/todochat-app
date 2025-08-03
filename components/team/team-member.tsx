"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PresenceIndicator } from "@/components/ui/presence-indicator";
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
  Edit,
} from "lucide-react";
import type { TeamMember as TeamMemberType } from "@/types/team";
import { formatJoinDate, getInitials } from "@/utils/team-utils";

interface TeamMemberProps {
  member: TeamMemberType;
  onEdit?: (member: TeamMemberType) => void;
  onViewProfile?: (member: TeamMemberType) => void;
}

export function TeamMember({ member, onEdit, onViewProfile }: TeamMemberProps) {
  return (
    <Card
      className="group border-purple-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-white rounded-2xl overflow-hidden"
      role="article"
      aria-labelledby={`member-name-${member._id}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarFallback
                  className="bg-gradient-to-br from-purple-400 to-pink-500 text-white font-semibold"
                  aria-label={`Avatar for ${member.name}`}
                >
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div>
              <h3
                id={`member-name-${member._id}`}
                className="font-semibold text-gray-900"
              >
                {member.name}
              </h3>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Actions for ${member.name}`}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onViewProfile && (
                <DropdownMenuItem onClick={() => onViewProfile(member)}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  View Profile
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(member)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Member
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <Mail className="w-4 h-4 text-gray-400" aria-hidden="true" />
            <span className="text-gray-600">{member.email}</span>
          </div>

          {member.phone && (
            <div className="flex items-center space-x-3 text-sm">
              <Phone className="w-4 h-4 text-gray-400" aria-hidden="true" />
              <span className="text-gray-600">{member.phone}</span>
            </div>
          )}

          {member.location && (
            <div className="flex items-center space-x-3 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" aria-hidden="true" />
              <span className="text-gray-600">{member.location}</span>
            </div>
          )}

          <div className="flex items-center space-x-3 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" aria-hidden="true" />
            <span className="text-gray-600">
              Joined {formatJoinDate(member.joinDate)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
