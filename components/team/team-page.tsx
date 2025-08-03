"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Header } from "@/components/header";
import { TeamMember } from "./team-member";
import { TeamMembers } from "./team-members";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, Search, Filter } from "lucide-react";
import { AddMemberDialog } from "./add-member-dialog";
import { useTeamMembersWithPresence } from "@/hooks/use-team-members-with-presence";
import { Input } from "@/components/ui/input";

interface TeamMemberType {
  _id: string;
  name: string;
  email: string;
  joinDate?: number;
  phone?: string;
}

export function TeamPageComponent() {
  const [selectedTeam] = useState("team-1");
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { members: teamMembers, stats } =
    useTeamMembersWithPresence(selectedTeam);

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeView="team" />

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
              onClick={() => setShowAddMemberDialog(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Add Member
            </Button>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Team Members List */}
            <div className="lg:col-span-3">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-gray-600" />
                      <span>Team Members</span>
                      <span className="text-sm text-gray-500 font-normal">
                        ({filteredMembers.length} of {stats.total})
                      </span>
                    </CardTitle>

                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search members..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 text-sm"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hidden sm:flex"
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {filteredMembers.map((member) => (
                      <div
                        key={member._id}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
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
                          <Button variant="ghost" size="sm">
                            <span className="text-gray-400">•••</span>
                          </Button>
                        </div>
                      </div>
                    ))}

                    {filteredMembers.length === 0 && (
                      <div className="text-center py-12">
                        <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500 mb-2">
                          {searchTerm
                            ? "No members found"
                            : "No team members yet"}
                        </p>
                        {!searchTerm && (
                          <Button
                            onClick={() => setShowAddMemberDialog(true)}
                            variant="outline"
                            size="sm"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add your first member
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Members Sidebar */}
            <div className="lg:col-span-1">
              <TeamMembers teamId={selectedTeam} />
            </div>
          </div>
        </div>
      </div>

      <AddMemberDialog
        open={showAddMemberDialog}
        onOpenChange={setShowAddMemberDialog}
        teamId={selectedTeam}
      />
    </div>
  );
}
