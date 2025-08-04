import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo } from "react";

/**
 * Hook for managing team presence and member data
 * Returns team members with online status and online count
 */
export function useTeamPresence(teamId: string, currentUser: any) {
  // Get team members
  const teamMembers = useQuery(api.users.debugUsers);

  // Get online users for the team
  const onlineUsers = useQuery(api.presence.list, {
    roomToken: teamId,
  });

  // Calculate online count and combine member data with presence
  const { members, onlineCount } = useMemo(() => {
    if (!teamMembers) {
      return { members: [], onlineCount: 0 };
    }

    const onlineUserIds = new Set(onlineUsers?.map((u) => u.userId) || []);
    const onlineCount = onlineUserIds.size;

    const members = teamMembers.map((member) => ({
      ...member,
      name:
        `${member.firstName || ""} ${member.lastName || ""}`.trim() ||
        member.email,
      joinDate: member._creationTime,
      isOnline: onlineUserIds.has(member._id),
    }));

    return { members, onlineCount };
  }, [teamMembers, onlineUsers]);

  return {
    members,
    onlineCount,
    isLoading: teamMembers === undefined,
  };
}
