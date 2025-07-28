import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import usePresence from "@convex-dev/presence/react";
import { useMemo, useState, useEffect } from "react";

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  status?: "online" | "offline";
  role?: string;
  joinDate?: number;
  phone?: string;
  location?: string;
  imageUrl?: string;
}

export function useTeamMembersWithPresence(teamId: string) {
  const [presenceError, setPresenceError] = useState(false);

  // Get current user ID
  const currentUserId = useQuery(api.presence.getUserId);

  // Get team members
  const teamMembers = useQuery(api.teams.getTeamMembers, { teamId });

  // Use presence system for the team room
  const presenceState = usePresence(api.presence, teamId, currentUserId || "");

  // Handle presence errors
  useEffect(() => {
    if (presenceState === undefined && currentUserId) {
      setPresenceError(true);
    } else {
      setPresenceError(false);
    }
  }, [presenceState, currentUserId]);

  // Create a map of online users from presence state
  const onlineUsers = useMemo(() => {
    const onlineSet = new Set<string>();

    // Add users from presence state
    if (presenceState && currentUserId && !presenceError) {
      presenceState.forEach((entry) => {
        if (entry.online) {
          onlineSet.add(entry.userId);
        }
      });
    }

    // Always add current user to online set if they have a userId
    if (currentUserId) {
      onlineSet.add(currentUserId);
    }

    return onlineSet;
  }, [presenceState, currentUserId, presenceError]);

  // Merge team members with presence data
  const membersWithPresence = useMemo(() => {
    if (!teamMembers) return [];

    return teamMembers.map((member) => {
      const isOnline = onlineUsers.has(member._id);

      return {
        ...member,
        // If this is the current user and they have a userId, they are always online
        status:
          currentUserId && member._id === currentUserId
            ? ("online" as const)
            : presenceError
              ? ("offline" as const)
              : isOnline
                ? ("online" as const)
                : ("offline" as const),
      };
    });
  }, [teamMembers, onlineUsers, presenceError, currentUserId]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = membersWithPresence.length;
    const online = membersWithPresence.filter(
      (m) => m.status === "online"
    ).length;
    const offline = total - online;

    return {
      total,
      online,
      offline,
      onlinePercentage: total > 0 ? Math.round((online / total) * 100) : 0,
    };
  }, [membersWithPresence]);

  return {
    members: membersWithPresence,
    stats,
    isLoading: teamMembers === undefined,
    currentUserId,
    isPresenceReady: currentUserId !== undefined && !presenceError,
    hasPresenceError: presenceError,
  };
}
