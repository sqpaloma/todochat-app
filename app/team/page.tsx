"use client";

import { useState, useCallback } from "react";
import { AddMemberDialog } from "@/components/team/add-member-dialog";
import { EditMemberDialog } from "@/components/team/edit-member-dialog";
import { MemberDetailsDialog } from "@/components/team/member-details-dialog";
import { gradientClasses } from '@/lib/gradient-classes';
import { useModalManager } from '@/hooks/use-modal-manager';

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
  const { modals, openModal, closeModal } = useModalManager<TeamMemberType>();

  // Use the new presence-enabled hook
  const {
    members: teamMembers,
    stats,
    isLoading,
  } = useTeamMembersWithPresence(selectedTeam);

  // Use the new filters hook
  const { filters, filteredMembers, updateFilters, clearFilters } =
    useTeamFilters(teamMembers);

  // Memoized event handlers
  const handleEditMember = useCallback((member: TeamMemberType) => {
    openModal('edit', member);
  }, [openModal]);

  const handleViewProfile = useCallback((member: TeamMemberType) => {
    openModal('details', member);
  }, [openModal]);

  const handleAddMember = useCallback(() => {
    openModal('add');
  }, [openModal]);

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
          className={`${gradientClasses.primaryButton} text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200`}
          aria-label="Add new team member"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </header>

      {/* Search and Filters */}
      <TeamFilters
        filters={filters}
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
        open={modals.add.isOpen}
        onOpenChange={(open) => !open && closeModal('add')}
        teamId={selectedTeam}
      />

      <EditMemberDialog
        open={modals.edit.isOpen}
        onOpenChange={(open) => !open && closeModal('edit')}
        member={modals.edit.data || null}
        teamId={selectedTeam}
      />

      <MemberDetailsDialog
        open={modals.details.isOpen}
        onOpenChange={(open) => !open && closeModal('details')}
        member={modals.details.data || null}
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
