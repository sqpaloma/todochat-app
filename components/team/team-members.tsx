"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MoreVertical,
  Edit,
} from "lucide-react";
import { useTeamMembersWithPresence } from "@/hooks/use-team-members-with-presence";
import type { TeamMember as TeamMemberType } from "@/types/team";
import { formatJoinDate, getInitials } from "@/utils/team-utils";

interface TeamMembersProps {
  teamId: string;
  onEditMember?: (member: TeamMemberType) => void;
  viewMode?: "list" | "cards" | "both";
}

export function TeamMembers({
  teamId,
  onEditMember,
  viewMode = "both",
}: TeamMembersProps) {
  const { members, stats } = useTeamMembersWithPresence(teamId);

  const renderMemberCard = (member: TeamMemberType) => (
    <Card
      key={member._id}
      className="group border-purple-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-white rounded-2xl overflow-hidden"
      role="article"
      aria-labelledby={`member-name-${member._id}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="w-12 h-12">
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <AvatarFallback
                    className="bg-gradient-to-br from-purple-400 to-pink-500 text-white font-semibold"
                    aria-label={`Avatar for ${member.name}`}
                  >
                    {getInitials(member.name)}
                  </AvatarFallback>
                )}
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

          {onEditMember && (
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
                <DropdownMenuItem onClick={() => onEditMember(member)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Member
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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

  const renderMemberListItem = (member: TeamMemberType) => (
    <div key={member._id} className="flex items-center space-x-3">
      <div className="relative">
        <Avatar className="w-8 h-8">
          {member.imageUrl ? (
            <img
              src={member.imageUrl}
              alt={member.name}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <AvatarFallback className="bg-blue-500 text-white text-sm">
              {getInitials(member.name)}
            </AvatarFallback>
          )}
        </Avatar>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {member.name}
        </p>
        <p className="text-xs text-gray-500 truncate">{member.email}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Team Stats Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Team ({stats.total})
          </CardTitle>
        </CardHeader>
      </Card>

      {/* List View */}
      {(viewMode === "list" || viewMode === "both") && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Team Members List
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {members.map(renderMemberListItem)}

              {members.length === 0 && (
                <div className="text-center py-4 text-gray-400">
                  <Users className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">No members</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cards View */}
      {(viewMode === "cards" || viewMode === "both") && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Team Members</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map(renderMemberCard)}

            {members.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3" />
                <p className="text-lg">No team members</p>
                <p className="text-sm">Add members to get started</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
