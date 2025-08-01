import type { TeamMember } from "@/types/team";

/**
 * Format join date to a readable string
 */
export function formatJoinDate(timestamp?: number): string {
  if (!timestamp) return "Date not provided";
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}

/**
 * Get status text from status value
 */
export function getStatusText(status?: string): string {
  switch (status) {
    case "online":
      return "Online";
    case "offline":
      return "Offline";
    default:
      return "Unknown";
  }
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Calculate team statistics
 */
export function calculateTeamStats(members: TeamMember[]) {
  const total = members.length;
  const online = members.filter((m) => m.status === "online").length;
  const offline = total - online;

  return {
    total,
    online,
    offline,
    onlinePercentage: total > 0 ? Math.round((online / total) * 100) : 0,
  };
}

/**
 * Filter members based on search term and filters
 */
export function filterMembers(
  members: TeamMember[],
  searchTerm: string,
  statusFilter: string,
  roleFilter: string
): TeamMember[] {
  return members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || member.status === statusFilter;

    const matchesRole = roleFilter === "all" || member.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });
}

/**
 * Get unique roles from team members
 */
export function getUniqueRoles(members: TeamMember[]): string[] {
  const roles = members
    .map((member) => member.role)
    .filter((role): role is string => Boolean(role));
  return Array.from(new Set(roles));
}

/**
 * Sort members by status (online first) and then by name
 */
export function sortMembers(members: TeamMember[]): TeamMember[] {
  return [...members].sort((a, b) => {
    // Sort by status first (online before offline)
    if (a.status !== b.status) {
      return a.status === "online" ? -1 : 1;
    }
    // Then sort by name
    return a.name.localeCompare(b.name);
  });
}
