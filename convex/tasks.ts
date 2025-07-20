import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const getTasks = query({
  args: { teamId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("teamId"), args.teamId))
      .order("desc")
      .collect()
  },
})

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
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
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
    })

    // Send email notification (in real app, this would call Resend API)
    console.log("📧 Email sent to:", args.assigneeEmail)
    console.log("Task created:", args.title)

    return taskId
  },
})

export const updateTaskStatus = mutation({
  args: {
    taskId: v.id("tasks"),
    status: v.union(v.literal("todo"), v.literal("in-progress"), v.literal("done")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.taskId, {
      status: args.status,
    })

    // Send email notification when task is completed
    if (args.status === "done") {
      console.log("📧 Task completion email sent")
    }

    return args.taskId
  },
})
