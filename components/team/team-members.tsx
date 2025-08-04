import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Users } from "lucide-react";
import { useTeamMembersWithPresence } from "@/hooks/use-team-members-with-presence";

interface TeamMembersProps {
  teamId: string;
}

export function TeamMembers({ teamId }: TeamMembersProps) {
  const { members, stats } = useTeamMembersWithPresence(teamId);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <Users className="w-4 h-4 mr-2" />
          Team ({stats.total})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {members.map((member) => (
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
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
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
          ))}

          {members.length === 0 && (
            <div className="text-center py-4 text-gray-400">
              <Users className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">No members</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
