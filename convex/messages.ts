import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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
