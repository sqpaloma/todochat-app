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

  return {
    total,
    online: 0,
    offline: total,
    onlinePercentage: 0,
  };
}

/**
 * Filter members based on search term
 */
export function filterMembers(
  members: TeamMember[],
  searchTerm: string
): TeamMember[] {
  return members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });
}

/**
 * Sort members by name
 */
export function sortMembers(members: TeamMember[]): TeamMember[] {
  return [...members].sort((a, b) => {
    // Sort by name
    return a.name.localeCompare(b.name);
  });
}
