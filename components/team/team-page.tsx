"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Header } from "@/components/header";
import { TeamMember } from "./team-member";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";
import { AddMemberDialog } from "./add-member-dialog";

interface TeamMemberType {
  _id: string;
  name: string;
  email: string;
  status?: "online" | "offline";
  role?: string;
  joinDate?: number;
  phone?: string;
  location?: string;
}

export function TeamPageComponent() {
  const [selectedTeam] = useState("team-1");
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);

  const teamMembers = useQuery(api.teams.getTeamMembers, {
    teamId: selectedTeam,
  });

  const onlineMembers = (teamMembers || []).filter(
    (member: TeamMemberType) => member.status === "online"
  ).length;
  const totalMembers = (teamMembers || []).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeView="team" />

      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Equipe</h1>
              <p className="text-gray-600">Gerencie os membros da sua equipe</p>
            </div>

            <Button
              onClick={() => setShowAddMemberDialog(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-semibold px-6 py-3"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Membro
            </Button>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-blue-900 mb-1">
                  {totalMembers}
                </h3>
                <p className="text-blue-600 text-sm font-medium">
                  Total de Membros
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-1">
                  {onlineMembers}
                </h3>
                <p className="text-green-600 text-sm font-medium">
                  Online Agora
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-8 h-8 bg-orange-500 rounded-full mx-auto mb-4"></div>
                <h3 className="text-2xl font-bold text-orange-900 mb-1">
                  {totalMembers - onlineMembers}
                </h3>
                <p className="text-orange-600 text-sm font-medium">Offline</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-8 h-8 bg-purple-500 rounded-xl mx-auto mb-4 flex items-center justify-center text-white text-xs font-bold">
                  %
                </div>
                <h3 className="text-2xl font-bold text-purple-900 mb-1">
                  {totalMembers > 0
                    ? Math.round((onlineMembers / totalMembers) * 100)
                    : 0}
                  %
                </h3>
                <p className="text-purple-600 text-sm font-medium">
                  Taxa de Atividade
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-600" />
                <span>Membros da Equipe</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(teamMembers || []).map((member: TeamMemberType) => (
                  <TeamMember key={member._id} member={member} />
                ))}
              </div>
            </CardContent>
          </Card>
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
