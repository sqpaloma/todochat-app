import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const trackEmailSent = mutation({
  args: {
    type: v.union(
      v.literal("nudge"),
      v.literal("team_invitation"), 
      v.literal("task_notification"),
      v.literal("daily_digest"),
      v.literal("task_completion")
    ),
    to: v.string(),
    subject: v.string(),
    messageId: v.optional(v.id("messages")),
    taskId: v.optional(v.id("tasks")),
    teamId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("emailAnalytics", {
      ...args,
      sentAt: Date.now(),
      status: "sent" as const,
    });
  },
});

export const trackEmailError = mutation({
  args: {
    type: v.union(
      v.literal("nudge"),
      v.literal("team_invitation"), 
      v.literal("task_notification"),
      v.literal("daily_digest"),
      v.literal("task_completion")
    ),
    to: v.string(),
    error: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("emailAnalytics", {
      ...args,
      sentAt: Date.now(),
      status: "error" as const,
    });
  },
});

export const getEmailStats = query({
  args: {
    days: v.optional(v.number()),
    type: v.optional(v.union(
      v.literal("nudge"),
      v.literal("team_invitation"), 
      v.literal("task_notification"),
      v.literal("daily_digest"),
      v.literal("task_completion")
    )),
  },
  handler: async (ctx, args) => {
    const daysAgo = args.days || 7;
    const startDate = Date.now() - (daysAgo * 24 * 60 * 60 * 1000);
    
    let query = ctx.db.query("emailAnalytics")
      .filter((q) => q.gte(q.field("sentAt"), startDate));
    
    if (args.type) {
      query = query.filter((q) => q.eq(q.field("type"), args.type));
    }
    
    const emails = await query.collect();
    
    const stats = {
      total: emails.length,
      sent: emails.filter(e => e.status === "sent").length,
      errors: emails.filter(e => e.status === "error").length,
      byType: {} as Record<string, number>,
      recentEmails: emails.slice(-10).reverse(),
    };
    
    emails.forEach(email => {
      stats.byType[email.type] = (stats.byType[email.type] || 0) + 1;
    });
    
    return stats;
  },
});