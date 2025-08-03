import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const sendBulkTaskReminders = internalMutation({
  args: {
    teamId: v.string(),
    reminderMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const overdueTasks = await ctx.db
      .query("tasks")
      .filter((q) => 
        q.and(
          q.eq(q.field("teamId"), args.teamId),
          q.neq(q.field("status"), "done"),
          q.lt(q.field("dueDate"), Date.now())
        )
      )
      .collect();

    const tasksByAssignee = overdueTasks.reduce((acc, task) => {
      if (!acc[task.assigneeId]) {
        acc[task.assigneeId] = {
          assigneeName: task.assigneeName,
          tasks: []
        };
      }
      acc[task.assigneeId].tasks.push(task);
      return acc;
    }, {} as Record<string, { assigneeName: string; tasks: any[] }>);

    const emailPromises = Object.entries(tasksByAssignee).map(async ([assigneeId, data]) => {
      const user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("clerkUserId"), assigneeId))
        .first();

      if (!user) return;

      await ctx.scheduler.runAfter(0, internal.emails.sendTaskReminderBatch, {
        to: user.email,
        assigneeName: data.assigneeName,
        tasks: data.tasks.map(task => ({
          _id: task._id,
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          priority: task.priority,
        })),
        customMessage: args.reminderMessage,
      });
    });

    await Promise.all(emailPromises);
    return { sent: Object.keys(tasksByAssignee).length };
  },
});

export const sendTeamAnnouncement = internalMutation({
  args: {
    teamId: v.string(),
    subject: v.string(),
    message: v.string(),
    fromName: v.string(),
  },
  handler: async (ctx, args) => {
    const team = await ctx.db
      .query("teams")
      .filter((q) => q.eq(q.field("_id"), args.teamId))
      .first();

    if (!team) throw new Error("Team not found");

    const users = await Promise.all(
      team.members.map(async (memberId) => {
        return await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("clerkUserId"), memberId))
          .first();
      })
    );

    const validUsers = users.filter(Boolean);

    const emailPromises = validUsers.map(async (user) => {
      if (!user) return;
      
      await ctx.scheduler.runAfter(0, internal.emails.sendAnnouncementEmail, {
        to: user.email,
        subject: args.subject,
        message: args.message,
        fromName: args.fromName,
        teamName: team.name,
        recipientName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
      });
    });

    await Promise.all(emailPromises);
    return { sent: validUsers.length };
  },
});