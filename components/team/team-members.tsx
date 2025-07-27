import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Circle } from "lucide-react";

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  status?: "online" | "offline";
}

interface TeamMembersProps {
  members: TeamMember[];
}

export function TeamMembers({ members }: TeamMembersProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <Users className="w-4 h-4 mr-2" />
          Team ({members.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {members.map((member) => (
            <div key={member._id} className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-500 text-white text-sm">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Circle
                  className={`w-3 h-3 absolute -bottom-0.5 -right-0.5 ${
                    member.status === "online"
                      ? "text-green-500 fill-green-500"
                      : "text-gray-400 fill-gray-400"
                  }`}
                />
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
