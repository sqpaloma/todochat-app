"use client"

import type React from "react"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Mail, User, MapPin, Phone } from "lucide-react"

interface AddMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teamId: string
}

export function AddMemberDialog({ open, onOpenChange, teamId }: AddMemberDialogProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("member")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const addMember = useMutation(api.teams.addMember)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    setIsLoading(true)

    try {
      await addMember({
        teamId,
        name: name.trim(),
        email: email.trim(),
        role,
        phone: phone.trim() || undefined,
        location: location.trim() || undefined,
      })

      // Reset form
      setName("")
      setEmail("")
      setRole("member")
      setPhone("")
      setLocation("")
      onOpenChange(false)

      // In real app, send invitation email
      console.log("📧 Convite enviado para:", email)
    } catch (error) {
      console.error("Error adding member:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const roles = [
    { value: "admin", label: "Administrador", description: "Acesso total ao projeto" },
    { value: "manager", label: "Gerente", description: "Pode gerenciar tarefas e membros" },
    { value: "member", label: "Membro", description: "Pode criar e editar tarefas" },
    { value: "viewer", label: "Visualizador", description: "Apenas visualização" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-blue-500" />
            <span>Adicionar Novo Membro</span>
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
                      <div className="text-xs text-gray-500">{roleOption.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefone (opcional)</Label>
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
              <Label htmlFor="location">Localização (opcional)</Label>
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

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">📧 Convite por Email</h4>
            <p className="text-sm text-blue-700">
              Um convite será enviado automaticamente para o email informado com instruções para acessar a equipe.
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim() || !email.trim()}>
              {isLoading ? "Adicionando..." : "Adicionar Membro"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
