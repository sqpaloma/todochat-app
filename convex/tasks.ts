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

    // Send notification email using Convex Resend component
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

    // Send email when task is completed
    if (args.status === "done") {
      // Find team members to notify
      const teamMembers = [
        "joao@empresa.com",
        "maria@empresa.com",
        "pedro@empresa.com",
      ]; // In a real app, this would come from the database

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

export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.string(),
    description: v.optional(v.string()),
    assigneeId: v.string(),
    assigneeName: v.string(),
    assigneeEmail: v.string(),
    dueDate: v.optional(v.number()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");

    await ctx.db.patch(args.taskId, {
      title: args.title,
      description: args.description || "",
      assigneeId: args.assigneeId,
      assigneeName: args.assigneeName,
      dueDate: args.dueDate,
      priority: args.priority,
    });

    return args.taskId;
  },
});

export const deleteTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.taskId);
  },
});

export const getTasksForUser = query({
  args: {
    userId: v.string(),
    teamId: v.string(),
    status: v.optional(
      v.union(v.literal("todo"), v.literal("in-progress"), v.literal("done"))
    ),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("tasks")
      .filter((q) =>
        q.and(
          q.eq(q.field("assigneeId"), args.userId),
          q.eq(q.field("teamId"), args.teamId)
        )
      );

    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }

    return await query.order("desc").collect();
  },
});

export const getOverdueTasks = query({
  args: {
    userId: v.string(),
    teamId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .filter((q) =>
        q.and(
          q.eq(q.field("assigneeId"), args.userId),
          q.eq(q.field("teamId"), args.teamId),
          q.neq(q.field("status"), "done"),
          q.lt(q.field("dueDate"), Date.now())
        )
      )
      .order("asc")
      .collect();
  },
});

export const sendOverdueTaskNotification = mutation({
  args: {
    userId: v.string(),
    teamId: v.string(),
    nudgerUserName: v.string(),
  },
  handler: async (ctx, args) => {
    // Get overdue tasks for the user
    const overdueTasks = await ctx.db
      .query("tasks")
      .filter((q) =>
        q.and(
          q.eq(q.field("assigneeId"), args.userId),
          q.eq(q.field("teamId"), args.teamId),
          q.neq(q.field("status"), "done"),
          q.lt(q.field("dueDate"), Date.now())
        )
      )
      .order("asc")
      .collect();

    if (overdueTasks.length === 0) {
      return { message: "No overdue tasks found" };
    }

    // Get user details
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkUserId"), args.userId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Get team details
    const team = await ctx.db
      .query("teams")
      .filter((q) => q.eq(q.field("_id"), args.teamId))
      .unique();

    // Helper function to get user display name
    const getDisplayName = (user: any) => {
      if (!user) return "Anonymous";

      const fullName = [user.firstName, user.lastName]
        .filter(Boolean)
        .join(" ");

      if (fullName.trim()) return fullName;

      if (user.email) {
        const emailUsername = user.email.split("@")[0];
        return emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1);
      }

      return "Anonymous";
    };

    const userDisplayName = getDisplayName(user);

    // Send overdue task reminder email
    await ctx.scheduler.runAfter(0, internal.emails.sendOverdueTaskReminder, {
      to: user.email,
      toName: userDisplayName,
      tasks: overdueTasks.map((task) => ({
        _id: task._id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate!,
        priority: task.priority,
      })),
      teamName: team?.name || "Team Chat",
    });

    return {
      success: true,
      overdueTasksCount: overdueTasks.length,
      message: `Sent overdue task notification to ${userDisplayName}`,
    };
  },
});
