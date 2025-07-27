"use client";

import type React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Shield,
  Clock,
  MessageSquare,
  Edit,
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

interface MemberDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMemberType | null;
  onEdit?: (member: TeamMemberType) => void;
}

export function MemberDetailsDialog({
  open,
  onOpenChange,
  member,
  onEdit,
}: MemberDetailsDialogProps) {
  if (!member) return null;

  const formatJoinDate = (timestamp?: number) => {
    if (!timestamp) return "Date not provided";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "online":
        return "Online";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4 text-red-500" />;
      case "manager":
        return <User className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleDescription = (role?: string) => {
    switch (role) {
      case "admin":
        return "Administrator with full system access";
      case "manager":
        return "Manager responsible for tasks and members";
      case "member":
        return "Team member with standard access";
      case "viewer":
        return "Viewer with limited permissions";
      default:
        return "Role not defined";
    }
  };

  const daysSinceJoined = member.joinDate
    ? Math.floor((Date.now() - member.joinDate) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes do Membro</span>
            <Badge variant="outline" className="text-xs">
              ID: {member._id}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header do perfil */}
          <div className="flex items-start space-x-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white font-bold text-xl">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute -bottom-1 -right-1 w-6 h-6 ${getStatusColor(member.status)} rounded-full border-3 border-white flex items-center justify-center`}
              >
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {member.name}
              </h2>
              <p className="text-gray-600 mb-2">{member.email}</p>

              <div className="flex items-center space-x-3">
                <Badge
                  variant={member.status === "online" ? "default" : "secondary"}
                  className="flex items-center space-x-1"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${getStatusColor(member.status)}`}
                  />
                  <span>{getStatusText(member.status)}</span>
                </Badge>

                {member.role && (
                  <Badge
                    variant="outline"
                    className="flex items-center space-x-1"
                  >
                    {getRoleIcon(member.role)}
                    <span className="capitalize">{member.role}</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Informações detalhadas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2 text-blue-500" />
                  Informações Pessoais
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{member.email}</span>
                  </div>

                  {member.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Telefone:</span>
                      <span className="font-medium">{member.phone}</span>
                    </div>
                  )}

                  {member.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Localização:</span>
                      <span className="font-medium">{member.location}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-purple-500" />
                  Informações Profissionais
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Função:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      {getRoleIcon(member.role)}
                      <span className="font-medium capitalize">
                        {member.role || "Não definida"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {getRoleDescription(member.role)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Membro desde:</span>
                  </div>
                  <div className="ml-6">
                    <span className="font-medium">
                      {formatJoinDate(member.joinDate)}
                    </span>
                    {daysSinceJoined > 0 && (
                      <p className="text-xs text-gray-500">
                        {daysSinceJoined} dia{daysSinceJoined !== 1 ? "s" : ""}{" "}
                        na equipe
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Estatísticas rápidas */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-orange-500" />
                Estatísticas Rápidas
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {daysSinceJoined}
                  </div>
                  <div className="text-xs text-gray-600">Dias na equipe</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {member.status === "online" ? "Ativo" : "Inativo"}
                  </div>
                  <div className="text-xs text-gray-600">Status atual</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">
                    {member.role?.charAt(0).toUpperCase() || "N/A"}
                  </div>
                  <div className="text-xs text-gray-600">Nível de acesso</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de ação */}
          <div className="flex justify-between pt-4 border-t">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Mensagem</span>
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
              {onEdit && (
                <Button
                  onClick={() => {
                    onEdit(member);
                    onOpenChange(false);
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
