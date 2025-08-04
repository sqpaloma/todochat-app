"use client";

import { useState } from "react";
import { AddMemberDialog } from "@/components/team/add-member-dialog";
import { EditMemberDialog } from "@/components/team/edit-member-dialog";
import { MemberDetailsDialog } from "@/components/team/member-details-dialog";
import { gradients } from "@/lib/design-tokens";

import { TeamFilters } from "@/components/team/team-filters";
import { TeamMembersGrid } from "@/components/team/team-members-grid";
import { Button } from "@/components/ui/button";
import { useTeamPresence } from "@/hooks/use-team-presence";
import { useTeamFilters } from "@/hooks/use-team-filters";
import { AuthGuard } from "@/components/auth/auth-guard";
import ErrorBoundary from "@/components/team/error-boundary";
import { Plus } from "lucide-react";
import type { TeamMember as TeamMemberType } from "@/types/team";

function TeamPageContent() {
  const [selectedTeam] = useState("team-1");

  // Simple modal states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMemberType | null>(
    null
  );

  // Use simplified team hook
  const { members: teamMembers, onlineCount } = useTeamPresence(
    selectedTeam,
    null
  );
  const stats = { total: teamMembers.length, online: onlineCount };
  const isLoading = false;

  // Use the new filters hook
  const { filters, filteredMembers, updateFilters, clearFilters } =
    useTeamFilters(teamMembers);

  // Simple event handlers
  const handleEditMember = (member: TeamMemberType) => {
    setSelectedMember(member);
    setShowEditDialog(true);
  };

  const handleViewProfile = (member: TeamMemberType) => {
    setSelectedMember(member);
    setShowDetailsDialog(true);
  };

  const handleAddMember = () => {
    setShowAddDialog(true);
  };

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
          className={`${gradients.primaryButton} text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200`}
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
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        teamId={selectedTeam}
      />

      <EditMemberDialog
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) setSelectedMember(null);
        }}
        member={selectedMember}
        teamId={selectedTeam}
      />

      <MemberDetailsDialog
        open={showDetailsDialog}
        onOpenChange={(open) => {
          setShowDetailsDialog(open);
          if (!open) setSelectedMember(null);
        }}
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
