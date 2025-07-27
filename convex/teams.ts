import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const getTeamMembers = query({
  args: { teamId: v.string() },
  handler: async (ctx, args) => {
    // Mock data for demo - in real app, this would come from database
    return [
      {
        _id: "user-1",
        name: "João Silva",
        email: "joao@empresa.com",
        status: "online" as const,
        role: "admin",
        joinDate: Date.now() - 86400000 * 30, // 30 days ago
        phone: "(11) 99999-1111",
        location: "São Paulo, SP",
      },
      {
        _id: "user-2",
        name: "Maria Santos",
        email: "maria@empresa.com",
        status: "online" as const,
        role: "manager",
        joinDate: Date.now() - 86400000 * 15, // 15 days ago
        phone: "(11) 99999-2222",
        location: "Rio de Janeiro, RJ",
      },
      {
        _id: "user-3",
        name: "Pedro Costa",
        email: "pedro@empresa.com",
        status: "offline" as const,
        role: "member",
        joinDate: Date.now() - 86400000 * 7, // 7 days ago
        location: "Belo Horizonte, MG",
      },
    ];
  },
});

export const addMember = mutation({
  args: {
    teamId: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.string(),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // In real app, this would add to database and send invitation email
    console.log("👥 New member added:", args.name);
    console.log("📧 Invitation sent to:", args.email);

    return {
      success: true,
      message: `Convite enviado para ${args.email}`,
    };
  },
});

// Função para enviar resumo diário para todos os membros da equipe
export const sendDailyDigestToTeam = internalMutation({
  args: {
    teamId: v.string(),
  },
  handler: async (ctx, args) => {
    // Buscar membros da equipe
    const members = [
      {
        _id: "user-1",
        name: "João Silva",
        email: "joao@empresa.com",
      },
      {
        _id: "user-2",
        name: "Maria Santos",
        email: "maria@empresa.com",
      },
      {
        _id: "user-3",
        name: "Pedro Costa",
        email: "pedro@empresa.com",
      },
    ];

    // Buscar todas as tarefas da equipe
    const allTasks = await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("teamId"), args.teamId))
      .collect();

    // Tarefas concluídas hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const completedToday = allTasks.filter(
      (task) => task.status === "done" && task.createdAt >= today.getTime()
    );

    // Enviar resumo para cada membro
    for (const member of members) {
      const memberTasks = allTasks.filter(
        (task) => task.assigneeId === member._id && task.status !== "done"
      );

      if (memberTasks.length > 0) {
        await ctx.scheduler.runAfter(0, "emails:sendDailyDigest" as any, {
          memberEmail: member.email,
          memberName: member.name,
          memberTasks: memberTasks.map((task) => ({
            _id: task._id,
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
          })),
          completedTasksCount: completedToday.length,
        });
      }
    }

    return { sent: members.length };
  },
});
