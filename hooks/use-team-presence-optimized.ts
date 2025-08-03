import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useMemo, useCallback, useRef } from "react";
import type { TeamMember, TeamStats } from "@/types/team";

// Debounce utility for heartbeat
function useDebounce<T extends (...args: any[]) => any>(callback: T, delay: number): T {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
}

export function useTeamPresenceOptimized(teamId: string) {
  const heartbeatIntervalRef = useRef<NodeJS.Timeout>();
  const sessionIdRef = useRef<string>();

  // Queries (memoized automatically by Convex)
  const currentUser = useQuery(api.users.current);
  const teamMembers = useQuery(api.users.debugUsers);
  const onlineUsers = useQuery(api.presence.list, { roomToken: teamId });

  // Mutations
  const heartbeat = useMutation(api.presence.heartbeat);

  // Generate stable session ID
  const sessionId = useMemo(() => {
    if (!sessionIdRef.current && currentUser?._id) {
      sessionIdRef.current = `session-${currentUser._id}-${Date.now()}`;
    }
    return sessionIdRef.current;
  }, [currentUser?._id]);

  // Debounced heartbeat to avoid spam
  const debouncedHeartbeat = useDebounce(
    useCallback(async () => {
      if (!currentUser?._id || !teamId || !sessionId) return;

      try {
        await heartbeat({
          roomId: teamId,
          userId: currentUser._id,
          sessionId,
          interval: 30000,
        });
      } catch (error) {
        console.error("Heartbeat failed:", error);
      }
    }, [currentUser?._id, teamId, sessionId, heartbeat]),
    1000 // 1s debounce
  );

  // Setup presence heartbeat
  useEffect(() => {
    if (!currentUser?._id || !teamId) return;

    // Send initial heartbeat
    debouncedHeartbeat();

    // Setup interval
    heartbeatIntervalRef.current = setInterval(debouncedHeartbeat, 30000);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [currentUser?._id, teamId, debouncedHeartbeat]);

  // Memoized members with presence (expensive calculation)
  const membersWithPresence = useMemo((): TeamMember[] => {
    if (!teamMembers || !onlineUsers) return [];

    // Create online users Set for O(1) lookup
    const onlineUserIds = new Set(
      onlineUsers
        .filter((user: any) => user.online)
        .map((user: any) => user.userId)
    );

    return teamMembers.map((member: any) => {
      const isOnline = onlineUserIds.has(member._id) || member._id === currentUser?._id;
      const displayName = `${member.firstName || ""} ${member.lastName || ""}`.trim() ||
                          member.email?.split("@")[0] ||
                          "Anonymous";

      return {
        _id: member._id,
        name: displayName,
        email: member.email || "",
        status: isOnline ? "online" : "offline",
        role: "member",
        joinDate: member._creationTime,
        imageUrl: member.imageUrl,
      };
    });
  }, [teamMembers, onlineUsers, currentUser?._id]);

  // Memoized stats calculation
  const stats = useMemo((): TeamStats => {
    const total = membersWithPresence.length;
    const online = membersWithPresence.filter(m => m.status === "online").length;
    
    return {
      total,
      online,
      offline: total - online,
      onlinePercentage: total > 0 ? Math.round((online / total) * 100) : 0,
    };
  }, [membersWithPresence]);

  // Loading states
  const isLoading = teamMembers === undefined;
  const isPresenceReady = onlineUsers !== undefined;

  return {
    members: membersWithPresence,
    stats,
    isLoading,
    currentUserId: currentUser?._id,
    isPresenceReady,
    hasPresenceError: false,
    // Expose control methods if needed
    refreshPresence: debouncedHeartbeat,
  };
}