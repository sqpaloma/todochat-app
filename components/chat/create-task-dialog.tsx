"use client"

import type React from "react"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, MessageSquare } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Message {
  _id: string
  content: string
  authorId: string
  authorName: string
  timestamp: number
}

interface TeamMember {
  _id: string
  name: string
  email: string
}

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  message: Message | null
  teamMembers: TeamMember[]
  teamId: string
}

export function CreateTaskDialog({ open, onOpenChange, message, teamMembers, teamId }: CreateTaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assigneeId, setAssigneeId] = useState("")
  const [dueDate, setDueDate] = useState<Date>()
  const [isLoading, setIsLoading] = useState(false)

  const createTask = useMutation(api.tasks.createTask)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !assigneeId) return

    setIsLoading(true)

    try {
      const assignee = teamMembers.find((member) => member._id === assigneeId)

      await createTask({
        title: title.trim(),
        description: description.trim(),
        assigneeId,
        assigneeName: assignee?.name || "",
        assigneeEmail: assignee?.email || "",
        teamId,
        createdBy: "user-1", // In real app, get from auth
        dueDate: dueDate?.getTime(),
        originalMessage: message?.content,
      })

      // Reset form
      setTitle("")
      setDescription("")
      setAssigneeId("")
      setDueDate(undefined)
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-fill title from message when dialog opens
  useState(() => {
    if (message && open) {
      setTitle(message.content.slice(0, 50) + (message.content.length > 50 ? "..." : ""))
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <span>Criar Tarefa</span>
          </DialogTitle>
        </DialogHeader>

        {message && (
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <p className="text-sm text-gray-600 mb-1">Mensagem original:</p>
            <p className="text-sm italic">"{message.content}"</p>
            <p className="text-xs text-gray-500 mt-1">Por {message.authorName}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título da Tarefa</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da tarefa..."
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione mais detalhes sobre a tarefa..."
              rows={3}
            />
          </div>

          <div>
            <Label>Responsável</Label>
            <Select value={assigneeId} onValueChange={setAssigneeId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um membro da equipe" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map((member) => (
                  <SelectItem key={member._id} value={member._id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Data de Vencimento (opcional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP", { locale: ptBR }) : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !title.trim() || !assigneeId}>
              {isLoading ? "Criando..." : "Criar Tarefa"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
