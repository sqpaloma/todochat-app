import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";

export const getTeamMembers = query({
  args: { teamId: v.string() },
  handler: async (ctx, args) => {
    // Buscar todos os usuários cadastrados no sistema
    const users = await ctx.db.query("users").collect();

    // Retornar usuários formatados para o componente de equipe
    return users.map((user) => ({
      _id: user._id,
      name:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Usuário",
      email: user.email,
      status: "online" as const, // Em uma implementação real, isso viria de um sistema de presença
      role: "member", // Em uma implementação real, isso viria da relação team-user
      joinDate: user._creationTime,
      phone: undefined, // Campo não existe na estrutura atual de usuários
      location: undefined, // Campo não existe na estrutura atual de usuários
      imageUrl: user.imageUrl,
    }));
  },
});

export const addMember = mutation({
  args: {
    teamId: v.string(),
    email: v.string(),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Verificar se o usuário atual tem permissão (deve estar autenticado)
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Buscar usuário pelo email
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .unique();

    if (!existingUser) {
      return {
        success: false,
        message: `Usuário com email ${args.email} não encontrado. O usuário precisa estar cadastrado no sistema.`,
      };
    }

    // Em uma implementação completa, aqui criaria uma relação team-member
    // Por enquanto, retornamos sucesso já que o usuário existe
    return {
      success: true,
      message: `Usuário ${existingUser.firstName || existingUser.email} encontrado no sistema`,
    };
  },
});

// Função para enviar resumo diário para todos os membros da equipe
export const sendDailyDigestToTeam = internalMutation({
  args: {
    teamId: v.string(),
  },
  handler: async (ctx, args) => {
    // Buscar todos os usuários cadastrados (em uma implementação real, apenas os da equipe)
    const members = await ctx.db.query("users").collect();

    // Buscar todas as tarefas da equipe
    const allTasks = await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("teamId"), args.teamId))
      .collect();

    // Tarefas concluídas hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const completedToday = allTasks.filter(
      (task) => task.status === "done" && task._creationTime >= today.getTime()
    );

    // Enviar resumo para cada membro
    for (const member of members) {
      const memberTasks = allTasks.filter(
        (task) => task.assigneeId === member._id && task.status !== "done"
      );

      if (memberTasks.length > 0) {
        await ctx.scheduler.runAfter(0, "emails:sendDailyDigest" as any, {
          memberEmail: member.email,
          memberName:
            `${member.firstName || ""} ${member.lastName || ""}`.trim() ||
            "Usuário",
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
