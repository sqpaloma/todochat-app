"use client";

import { useState } from "react";
import { AddMemberDialog } from "@/components/team/add-member-dialog";
import { EditMemberDialog } from "@/components/team/edit-member-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";
import { gradients } from "@/lib/design-tokens";
import { useTeamPresence } from "@/hooks/use-team-presence";
import { AuthGuard } from "@/components/auth/auth-guard";

import type { TeamMember as TeamMemberType } from "@/types/team";

function TeamPageContent() {
  const [selectedTeam] = useState("team-1");

  // Simple modal states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
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

  // Simple event handlers
  const handleEditMember = (member: TeamMemberType) => {
    setSelectedMember(member);
    setShowEditDialog(true);
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
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Team
              </h1>
              <p className="text-gray-600">Manage your team members</p>
            </div>

            <Button
              onClick={handleAddMember}
              className={`${gradients.primaryButton} text-white rounded-xl font-semibold px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-200`}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Add Member
            </Button>
          </div>

          {/* Main Content */}
          <div className="w-full">
            {/* Team Members List */}
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {teamMembers.map((member: TeamMemberType) => (
                    <div
                      key={member._id}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div
                            className={`w-10 h-10 ${gradients.primaryBr} rounded-full flex items-center justify-center text-white font-semibold`}
                          >
                            {member.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {member.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditMember(member)}
                        >
                          <span className="text-gray-400">•••</span>
                        </Button>
                      </div>
                    </div>
                  ))}

                  {teamMembers.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 mb-2">No team members yet</p>
                      <Button
                        onClick={handleAddMember}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add your first member
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

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
    </div>
  );
}

export default function TeamPage() {
  return (
    <AuthGuard pageName="Team">
      <TeamPageContent />
    </AuthGuard>
  );
}
