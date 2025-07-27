import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const getMessages = query({
  args: { teamId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("teamId"), args.teamId))
      .order("desc")
      .take(100);
  },
});

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
      reactions: [], // Initialize with empty reactions array
    });
    return messageId;
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const sendFile = mutation({
  args: {
    fileId: v.id("_storage"),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    teamId: v.string(),
    authorId: v.string(),
    authorName: v.string(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      content: `📎 ${args.fileName}`, // Default content for file messages
      teamId: args.teamId,
      authorId: args.authorId,
      authorName: args.authorName,
      timestamp: Date.now(),
      reactions: [],
      fileId: args.fileId,
      fileName: args.fileName,
      fileType: args.fileType,
      fileSize: args.fileSize,
    });
    return messageId;
  },
});

export const getFileUrl = query({
  args: { fileId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.fileId);
  },
});

export const nudgeUser = mutation({
  args: {
    messageId: v.id("messages"),
    nudgerUserId: v.string(),
    nudgerUserName: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the message details
    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    // Don't allow nudging yourself
    if (message.authorId === args.nudgerUserId) {
      throw new Error("You cannot nudge yourself");
    }

    // Get the message author's details
    const messageAuthor = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), message.authorId))
      .unique();

    if (!messageAuthor) {
      throw new Error("Message author not found");
    }

    // Get team details for context
    const team = await ctx.db
      .query("teams")
      .filter((q) => q.eq(q.field("_id"), message.teamId))
      .unique();

    // Get the author's display name
    const authorDisplayName =
      [messageAuthor.firstName, messageAuthor.lastName]
        .filter(Boolean)
        .join(" ") || "Anonymous";

    // Send the nudge email
    await ctx.scheduler.runAfter(0, internal.emails.sendNudgeEmail, {
      to: messageAuthor.email,
      toName: authorDisplayName,
      fromName: args.nudgerUserName,
      messageContent: message.content,
      messageId: args.messageId,
      teamName: team?.name || "Team Chat",
    });

    return { success: true };
  },
});

export const addReaction = mutation({
  args: {
    messageId: v.id("messages"),
    emoji: v.string(),
    userId: v.string(),
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    const reactions = message.reactions || [];

    // Find existing emoji reaction
    const existingEmojiIndex = reactions.findIndex(
      (r) => r.emoji === args.emoji
    );

    if (existingEmojiIndex >= 0) {
      // Emoji reaction exists, check if user already reacted
      const emojiReaction = reactions[existingEmojiIndex];
      const existingUserIndex = emojiReaction.users.findIndex(
        (u) => u.userId === args.userId
      );

      if (existingUserIndex >= 0) {
        // User already reacted with this emoji, remove their reaction
        emojiReaction.users.splice(existingUserIndex, 1);

        // If no users left for this emoji, remove the entire emoji reaction
        if (emojiReaction.users.length === 0) {
          reactions.splice(existingEmojiIndex, 1);
        }
      } else {
        // User hasn't reacted with this emoji, add their reaction
        emojiReaction.users.push({
          userId: args.userId,
          userName: args.userName,
          timestamp: Date.now(),
        });
      }
    } else {
      // Emoji reaction doesn't exist, create new one
      reactions.push({
        emoji: args.emoji,
        users: [
          {
            userId: args.userId,
            userName: args.userName,
            timestamp: Date.now(),
          },
        ],
      });
    }

    await ctx.db.patch(args.messageId, { reactions });
    return reactions;
  },
});

export const removeReaction = mutation({
  args: {
    messageId: v.id("messages"),
    emoji: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    const reactions = message.reactions || [];

    // Find existing emoji reaction
    const existingEmojiIndex = reactions.findIndex(
      (r) => r.emoji === args.emoji
    );

    if (existingEmojiIndex >= 0) {
      const emojiReaction = reactions[existingEmojiIndex];
      const existingUserIndex = emojiReaction.users.findIndex(
        (u) => u.userId === args.userId
      );

      if (existingUserIndex >= 0) {
        // Remove user's reaction
        emojiReaction.users.splice(existingUserIndex, 1);

        // If no users left for this emoji, remove the entire emoji reaction
        if (emojiReaction.users.length === 0) {
          reactions.splice(existingEmojiIndex, 1);
        }
      }
    }

    await ctx.db.patch(args.messageId, { reactions });
    return reactions;
  },
});
