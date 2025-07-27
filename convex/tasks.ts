import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const getTasks = query({
  args: { teamId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("teamId"), args.teamId))
      .order("desc")
      .collect();
  },
});

export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    assigneeId: v.string(),
    assigneeName: v.string(),
    assigneeEmail: v.string(),
    teamId: v.string(),
    createdBy: v.string(),
    dueDate: v.optional(v.number()),
    originalMessage: v.optional(v.string()),
    priority: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
    ),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description || "",
      status: "todo" as const,
      assigneeId: args.assigneeId,
      assigneeName: args.assigneeName,
      createdBy: args.createdBy,
      createdAt: Date.now(),
      dueDate: args.dueDate,
      originalMessage: args.originalMessage,
      teamId: args.teamId,
      priority: args.priority || "medium",
    });

    // Enviar email de notificação usando o componente Resend do Convex
    await ctx.scheduler.runAfter(0, "emails:sendTaskNotificationEmail" as any, {
      to: args.assigneeEmail,
      taskId,
      taskTitle: args.title,
      assigneeName: args.assigneeName,
      createdBy: args.createdBy,
      description: args.description,
      dueDate: args.dueDate,
    });

    return taskId;
  },
});

export const updateTaskStatus = mutation({
  args: {
    taskId: v.id("tasks"),
    status: v.union(
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("done")
    ),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");

    await ctx.db.patch(args.taskId, {
      status: args.status,
    });

    // Enviar email quando tarefa é concluída
    if (args.status === "done") {
      // Buscar membros da equipe para notificar
      const teamMembers = [
        "joao@empresa.com",
        "maria@empresa.com",
        "pedro@empresa.com",
      ]; // Em um app real, isso viria do banco de dados

      await ctx.scheduler.runAfter(0, "emails:sendTaskCompletionEmail" as any, {
        taskId: args.taskId,
        taskTitle: task.title,
        completedBy: task.assigneeName,
        teamMemberEmails: teamMembers,
      });
    }

    return args.taskId;
  },
});
