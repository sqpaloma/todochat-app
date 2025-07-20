import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const getMessages = query({
  args: { teamId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("teamId"), args.teamId))
      .order("desc")
      .take(100)
  },
})

export const sendMessage = mutation({
  args: {
    content: v.string(),
    teamId: v.string(),
    authorId: v.string(),
    authorName: v.string(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      content: args.content,
      teamId: args.teamId,
      authorId: args.authorId,
      authorName: args.authorName,
      timestamp: Date.now(),
    })
    return messageId
  },
})
