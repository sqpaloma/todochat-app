import { useState, useMemo } from "react";
import type { TeamMember, TeamFilters } from "@/types/team";
import { filterMembers, sortMembers } from "@/utils/team-utils";

export function useTeamFilters(teamMembers: TeamMember[] | undefined) {
  const [filters, setFilters] = useState<TeamFilters>({
    searchTerm: "",
  });

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    if (!teamMembers) return [];

    const filtered = filterMembers(teamMembers, filters.searchTerm);

    return sortMembers(filtered);
  }, [teamMembers, filters]);

  const updateFilters = (updates: Partial<TeamFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
    });
  };

  return {
    filters,
    filteredMembers,
    updateFilters,
    clearFilters,
  };
}
