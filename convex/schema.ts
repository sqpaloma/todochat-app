import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    content: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    teamId: v.string(),
    timestamp: v.number(),
    messageType: v.optional(v.union(v.literal("general"), v.literal("direct"))),
    recipientId: v.optional(v.string()), // Para mensagens diretas
    recipientName: v.optional(v.string()), // Para mensagens diretas
    reactions: v.optional(
      v.array(
        v.object({
          emoji: v.string(),
          users: v.array(
            v.object({
              userId: v.string(),
              userName: v.string(),
              timestamp: v.number(),
            })
          ),
        })
      )
    ),
    fileId: v.optional(v.id("_storage")),
    fileName: v.optional(v.string()),
    fileType: v.optional(v.string()),
    fileSize: v.optional(v.number()),
    // Campos para tarefas
    isTask: v.optional(v.boolean()),
    taskStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("accepted"),
        v.literal("rejected")
      )
    ),
    taskAssigneeId: v.optional(v.string()),
    taskAssigneeName: v.optional(v.string()),
    taskDueDate: v.optional(v.number()),
    taskCreatedBy: v.optional(v.string()),
    taskRespondedBy: v.optional(v.string()),
    taskRespondedByName: v.optional(v.string()),
    taskRespondedAt: v.optional(v.number()),
  }),

  tasks: defineTable({
    title: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("done")
    ),
    assigneeId: v.string(),
    assigneeName: v.string(),
    createdBy: v.string(),
    createdAt: v.number(),
    dueDate: v.optional(v.number()),
    originalMessage: v.optional(v.string()),
    teamId: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  }),

  teams: defineTable({
    name: v.string(),
    members: v.array(v.string()),
    createdAt: v.number(),
  }),

  users: defineTable({
    email: v.string(),
    clerkUserId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  }).index("by_clerkUserId", ["clerkUserId"]),
});
