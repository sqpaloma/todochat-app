"use client";

import { useState, useCallback } from "react";
import { AddMemberDialog } from "@/components/team/add-member-dialog";
import { EditMemberDialog } from "@/components/team/edit-member-dialog";
import { MemberDetailsDialog } from "@/components/team/member-details-dialog";
import { TeamStats } from "@/components/team/team-stats";
import { TeamFilters } from "@/components/team/team-filters";
import { TeamMembersGrid } from "@/components/team/team-members-grid";
import { Button } from "@/components/ui/button";
import { useTeamMembersWithPresence } from "@/hooks/use-team-members-with-presence";
import { useTeamFilters } from "@/hooks/use-team-filters";
import { AuthGuard } from "@/components/auth/auth-guard";
import ErrorBoundary from "@/components/team/error-boundary";
import { Plus } from "lucide-react";
import type { TeamMember as TeamMemberType } from "@/types/team";

function TeamPageContent() {
  const [selectedTeam] = useState("team-1");
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showEditMemberDialog, setShowEditMemberDialog] = useState(false);
  const [showMemberDetailsDialog, setShowMemberDetailsDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMemberType | null>(
    null
  );

  // Use the new presence-enabled hook
  const {
    members: teamMembers,
    stats,
    isLoading,
  } = useTeamMembersWithPresence(selectedTeam);

  // Use the new filters hook
  const { filters, filteredMembers, uniqueRoles, updateFilters, clearFilters } =
    useTeamFilters(teamMembers);

  // Memoized event handlers
  const handleEditMember = useCallback((member: TeamMemberType) => {
    setSelectedMember(member);
    setShowEditMemberDialog(true);
  }, []);

  const handleViewProfile = useCallback((member: TeamMemberType) => {
    setSelectedMember(member);
    setShowMemberDetailsDialog(true);
  }, []);

  const handleAddMember = useCallback(() => {
    setShowAddMemberDialog(true);
  }, []);

  const handleCloseAddDialog = useCallback(() => {
    setShowAddMemberDialog(false);
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setShowEditMemberDialog(false);
    setSelectedMember(null);
  }, []);

  const handleCloseDetailsDialog = useCallback(() => {
    setShowMemberDetailsDialog(false);
    setSelectedMember(null);
  }, []);

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center h-64"
        role="status"
        aria-label="Loading team members"
      >
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-600 mt-1">Manage your team members</p>
        </div>
        <Button
          onClick={handleAddMember}
          className="bg-purple-600 hover:bg-purple-700"
          aria-label="Add new team member"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </header>

      {/* Statistics Cards */}
      <TeamStats stats={stats} />

      {/* Search and Filters */}
      <TeamFilters
        filters={filters}
        uniqueRoles={uniqueRoles}
        onFiltersChange={updateFilters}
        onClearFilters={clearFilters}
      />

      {/* Team Members Grid */}
      <TeamMembersGrid
        members={filteredMembers}
        onEditMember={handleEditMember}
        onViewProfile={handleViewProfile}
      />

      {/* Dialogs */}
      <AddMemberDialog
        open={showAddMemberDialog}
        onOpenChange={handleCloseAddDialog}
        teamId={selectedTeam}
      />

      <EditMemberDialog
        open={showEditMemberDialog}
        onOpenChange={handleCloseEditDialog}
        member={selectedMember}
        teamId={selectedTeam}
      />

      <MemberDetailsDialog
        open={showMemberDetailsDialog}
        onOpenChange={handleCloseDetailsDialog}
        member={selectedMember}
      />
    </div>
  );
}

export default function TeamPage() {
  return (
    <AuthGuard pageName="Team">
      <ErrorBoundary>
        <TeamPageContent />
      </ErrorBoundary>
    </AuthGuard>
  );
}
