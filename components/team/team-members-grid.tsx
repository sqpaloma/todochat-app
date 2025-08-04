"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TeamMember } from "@/components/team/team-member";
import type { TeamMember as TeamMemberType } from "@/types/team";
import { Users } from "lucide-react";

interface TeamMembersGridProps {
  members: TeamMemberType[];
  onEditMember: (member: TeamMemberType) => void;
}

export function TeamMembersGrid({
  members,
  onEditMember,
}: TeamMembersGridProps) {
  if (members.length === 0) {
    return (
      <Card className="col-span-full border-purple-200">
        <CardContent className="p-8 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No members found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search filters or add the first member to your
            team.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member) => (
        <TeamMember
          key={member._id}
          member={member}
          onEdit={() => onEditMember(member)}
        />
      ))}
    </div>
  );
}
