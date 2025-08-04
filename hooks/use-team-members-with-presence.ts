import { useTeamPresence } from "./use-team-presence";

/**
 * Hook wrapper for team members with presence data
 * Provides the interface expected by team components
 */
export function useTeamMembersWithPresence(teamId: string) {
  const { members, onlineCount, isLoading } = useTeamPresence(teamId, null);

  const stats = {
    total: members.length,
    online: onlineCount,
    offline: members.length - onlineCount,
  };

  return {
    members,
    stats,
    isLoading,
  };
}
