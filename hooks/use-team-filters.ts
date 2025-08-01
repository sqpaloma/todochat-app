import { useState, useMemo } from "react";
import type { TeamMember, TeamFilters } from "@/types/team";
import { filterMembers, getUniqueRoles, sortMembers } from "@/utils/team-utils";

export function useTeamFilters(teamMembers: TeamMember[] | undefined) {
  const [filters, setFilters] = useState<TeamFilters>({
    searchTerm: "",
    statusFilter: "all",
    roleFilter: "all",
  });

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    if (!teamMembers) return [];

    const filtered = filterMembers(
      teamMembers,
      filters.searchTerm,
      filters.statusFilter,
      filters.roleFilter
    );

    return sortMembers(filtered);
  }, [teamMembers, filters]);

  // Get unique roles for filter dropdown
  const uniqueRoles = useMemo(() => {
    if (!teamMembers) return [];
    return getUniqueRoles(teamMembers);
  }, [teamMembers]);

  const updateFilters = (updates: Partial<TeamFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      statusFilter: "all",
      roleFilter: "all",
    });
  };

  return {
    filters,
    filteredMembers,
    uniqueRoles,
    updateFilters,
    clearFilters,
  };
}
