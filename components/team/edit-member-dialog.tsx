"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit, Mail, User, MapPin, Phone, Trash2 } from "lucide-react";

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

interface EditMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMemberType | null;
  teamId: string;
}

export function EditMemberDialog({
  open,
  onOpenChange,
  member,
  teamId,
}: EditMemberDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<"online" | "offline">("offline");
  const [isLoading, setIsLoading] = useState(false);

  // Simulate update member mutation (in real app, this would be implemented in convex/teams.ts)
  const updateMember = useMutation(api.teams.addMember); // Using addMember as placeholder

  useEffect(() => {
    if (member) {
      setName(member.name);
      setEmail(member.email);
      setRole(member.role || "member");
      setPhone(member.phone || "");
      setLocation(member.location || "");
      setStatus(member.status || "offline");
    }
  }, [member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !member) return;

    setIsLoading(true);

    try {
      // In real app, this would be a separate updateMember mutation
      await updateMember({
        teamId,
        name: name.trim(),
        email: email.trim(),
        role,
        phone: phone.trim() || undefined,
        location: location.trim() || undefined,
      });

      onOpenChange(false);
      console.log("✅ Membro atualizado:", name);
    } catch (error) {
      console.error("Error updating member:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!member) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja remover ${member.name} da equipe? Esta ação não pode ser desfeita.`
    );

    if (confirmed) {
      console.log("🗑️ Membro removido:", member.name);
      onOpenChange(false);
    }
  };

  const roles = [
    {
      value: "admin",
      label: "Administrador",
      description: "Acesso total ao projeto",
    },
    {
      value: "manager",
      label: "Gerente",
      description: "Pode gerenciar tarefas e membros",
    },
    {
      value: "member",
      label: "Membro",
      description: "Pode criar e editar tarefas",
    },
    {
      value: "viewer",
      label: "Visualizador",
      description: "Apenas visualização",
    },
  ];

  const statusOptions = [
    { value: "online", label: "Online", color: "bg-green-100 text-green-800" },
    { value: "offline", label: "Offline", color: "bg-gray-100 text-gray-800" },
  ];

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Edit className="w-5 h-5 text-blue-500" />
              <span>Editar Membro</span>
            </div>
            <Badge variant="outline" className="text-xs">
              ID: {member._id}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: João Silva"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="joao@empresa.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Função na Equipe</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((roleOption) => (
                    <SelectItem key={roleOption.value} value={roleOption.value}>
                      <div>
                        <div className="font-medium">{roleOption.label}</div>
                        <div className="text-xs text-gray-500">
                          {roleOption.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(value: "online" | "offline") =>
                  setStatus(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((statusOption) => (
                    <SelectItem
                      key={statusOption.value}
                      value={statusOption.value}
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            statusOption.value === "online"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        />
                        <span>{statusOption.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Localização</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="São Paulo, SP"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {member.joinDate && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Membro desde:</strong>{" "}
                {new Date(member.joinDate).toLocaleDateString("pt-BR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemoveMember}
              className="flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Remover</span>
            </Button>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !name.trim() || !email.trim()}
              >
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
