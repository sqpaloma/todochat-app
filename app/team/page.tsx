"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SidebarLayout } from "@/components/sidebar-layout";
import { TeamMember } from "@/components/team/team-member";
import { AddMemberDialog } from "@/components/team/add-member-dialog";
import { EditMemberDialog } from "@/components/team/edit-member-dialog";
import { MemberDetailsDialog } from "@/components/team/member-details-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Plus,
  Search,
  Filter,
  UserCheck,
  Clock,
  TrendingUp,
  MapPin,
} from "lucide-react";

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

function TeamPageContent() {
  const [selectedTeam] = useState("team-1");
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showEditMemberDialog, setShowEditMemberDialog] = useState(false);
  const [showMemberDetailsDialog, setShowMemberDetailsDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMemberType | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const teamMembers = useQuery(api.teams.getTeamMembers, {
    teamId: selectedTeam,
  });

  // Filtrar e pesquisar membros
  const filteredMembers = useMemo(() => {
    if (!teamMembers) return [];

    return teamMembers.filter((member: TeamMemberType) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || member.status === statusFilter;
      const matchesRole = roleFilter === "all" || member.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [teamMembers, searchTerm, statusFilter, roleFilter]);

  // Estatísticas da equipe
  const stats = useMemo(() => {
    if (!teamMembers) return { total: 0, online: 0, offline: 0, activeRate: 0 };

    const total = teamMembers.length;
    const online = teamMembers.filter(
      (member: TeamMemberType) => member.status === "online"
    ).length;
    const offline = total - online;
    const activeRate = total > 0 ? Math.round((online / total) * 100) : 0;

    return { total, online, offline, activeRate };
  }, [teamMembers]);

  // Obter localizações únicas
  const locations = useMemo(() => {
    if (!teamMembers) return [];
    const locationSet = new Set(
      teamMembers
        .map((member: TeamMemberType) => member.location)
        .filter(Boolean)
    );
    return Array.from(locationSet);
  }, [teamMembers]);

  // Obter funções únicas
  const roles = useMemo(() => {
    if (!teamMembers) return [];
    const roleSet = new Set(
      teamMembers
        .map((member: TeamMemberType) => member.role)
        .filter((role): role is string => Boolean(role))
    );
    return Array.from(roleSet);
  }, [teamMembers]);

  const handleEditMember = (member: TeamMemberType) => {
    setSelectedMember(member);
    setShowEditMemberDialog(true);
  };

  const handleViewMemberProfile = (member: TeamMemberType) => {
    setSelectedMember(member);
    setShowMemberDetailsDialog(true);
  };

  return (
    <div className="h-full p-4 sm:p-6 lg:p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Equipe
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Gerencie os membros da sua equipe de forma inteligente
            </p>
          </div>

          <Button
            onClick={() => setShowAddMemberDialog(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-semibold px-6 py-3 transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Adicionar Membro
          </Button>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-sm hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6 text-center">
              <Users className="w-6 sm:w-8 h-6 sm:h-8 text-blue-500 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-1">
                {stats.total}
              </h3>
              <p className="text-blue-600 text-xs sm:text-sm font-medium">
                Total de Membros
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-sm hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-6 sm:w-8 h-6 sm:h-8 bg-green-500 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <div className="w-2 sm:w-3 h-2 sm:h-3 bg-white rounded-full"></div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-green-900 mb-1">
                {stats.online}
              </h3>
              <p className="text-green-600 text-xs sm:text-sm font-medium">
                Online Agora
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-0 shadow-sm hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6 text-center">
              <Clock className="w-6 sm:w-8 h-6 sm:h-8 text-orange-500 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-orange-900 mb-1">
                {stats.offline}
              </h3>
              <p className="text-orange-600 text-xs sm:text-sm font-medium">
                Offline
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-sm hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6 text-center">
              <TrendingUp className="w-6 sm:w-8 h-6 sm:h-8 text-purple-500 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-purple-900 mb-1">
                {stats.activeRate}%
              </h3>
              <p className="text-purple-600 text-xs sm:text-sm font-medium">
                Taxa de Atividade
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Pesquisa */}
        <Card className="border-0 shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span>Filtros e Pesquisa</span>
              <Badge variant="secondary" className="ml-auto">
                {filteredMembers.length}{" "}
                {filteredMembers.length === 1 ? "membro" : "membros"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Pesquisar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="online">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Online</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="offline">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      <span>Offline</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Funções</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{locations.length} localizações</span>
              </div>
            </div>

            {searchTerm && (
              <div className="mt-4 flex items-center space-x-2">
                <Badge variant="outline">Pesquisando por: "{searchTerm}"</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="text-xs"
                >
                  Limpar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lista de Membros */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-gray-600" />
              <span>Membros da Equipe</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMembers.map((member: TeamMemberType) => (
                  <TeamMember
                    key={member._id}
                    member={member}
                    onEdit={handleEditMember}
                    onViewProfile={handleViewMemberProfile}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm || statusFilter !== "all" || roleFilter !== "all"
                    ? "Nenhum membro encontrado"
                    : "Nenhum membro na equipe"}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm || statusFilter !== "all" || roleFilter !== "all"
                    ? "Tente ajustar os filtros ou pesquisar por outros termos."
                    : "Comece adicionando o primeiro membro da sua equipe."}
                </p>
                {!searchTerm &&
                  statusFilter === "all" &&
                  roleFilter === "all" && (
                    <Button
                      onClick={() => setShowAddMemberDialog(true)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-semibold px-6 py-3"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Adicionar Primeiro Membro
                    </Button>
                  )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <AddMemberDialog
        open={showAddMemberDialog}
        onOpenChange={setShowAddMemberDialog}
        teamId={selectedTeam}
      />

      <EditMemberDialog
        open={showEditMemberDialog}
        onOpenChange={setShowEditMemberDialog}
        member={selectedMember}
        teamId={selectedTeam}
      />

      <MemberDetailsDialog
        open={showMemberDetailsDialog}
        onOpenChange={setShowMemberDetailsDialog}
        member={selectedMember}
        onEdit={handleEditMember}
      />
    </div>
  );
}

export default function Team() {
  return (
    <SidebarLayout activeView="team">
      <TeamPageContent />
    </SidebarLayout>
  );
}
