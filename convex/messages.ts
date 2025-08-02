import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const getMessages = query({
  args: {
    teamId: v.string(),
    messageType: v.optional(v.union(v.literal("general"), v.literal("direct"))),
    recipientId: v.optional(v.string()),
    currentUserId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("teamId"), args.teamId));

    if (args.messageType) {
      if (
        args.messageType === "direct" &&
        args.recipientId &&
        args.currentUserId
      ) {
        // Mensagens diretas: buscar conversas entre dois usuários específicos
        query = query.filter((q) =>
          q.and(
            q.eq(q.field("messageType"), "direct"),
            q.or(
              q.and(
                q.eq(q.field("authorId"), args.currentUserId),
                q.eq(q.field("recipientId"), args.recipientId)
              ),
              q.and(
                q.eq(q.field("authorId"), args.recipientId),
                q.eq(q.field("recipientId"), args.currentUserId)
              )
            )
          )
        );
      } else {
        query = query.filter((q) =>
          q.eq(q.field("messageType"), args.messageType)
        );
      }
    } else {
      // Compatibilidade: se não especificar tipo, buscar mensagens gerais ou sem tipo
      query = query.filter((q) =>
        q.or(
          q.eq(q.field("messageType"), "general"),
          q.eq(q.field("messageType"), undefined)
        )
      );
    }

    return await query.order("desc").take(100);
  },
});

export const searchMessages = query({
  args: {
    teamId: v.string(),
    searchTerm: v.string(),
    messageType: v.optional(v.union(v.literal("general"), v.literal("direct"))),
  },
  handler: async (ctx, args) => {
    if (!args.searchTerm.trim()) {
      return [];
    }

    let query = ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("teamId"), args.teamId));

    if (args.messageType) {
      query = query.filter((q) =>
        q.eq(q.field("messageType"), args.messageType)
      );
    }

    const messages = await query.collect();

    // Filtro de busca simples por conteúdo
    return messages
      .filter(
        (message) =>
          message.content
            .toLowerCase()
            .includes(args.searchTerm.toLowerCase()) ||
          message.authorName
            .toLowerCase()
            .includes(args.searchTerm.toLowerCase())
      )
      .slice(0, 50);
  },
});

export const getDirectMessageContacts = query({
  args: { teamId: v.string(), currentUserId: v.string() },
  handler: async (ctx, args) => {
    const directMessages = await ctx.db
      .query("messages")
      .filter((q) =>
        q.and(
          q.eq(q.field("teamId"), args.teamId),
          q.eq(q.field("messageType"), "direct"),
          q.or(
            q.eq(q.field("authorId"), args.currentUserId),
            q.eq(q.field("recipientId"), args.currentUserId)
          )
        )
      )
      .collect();

    // Extrair contatos únicos
    const contactsMap = new Map();
    directMessages.forEach((msg) => {
      const contactId =
        msg.authorId === args.currentUserId ? msg.recipientId : msg.authorId;
      const contactName =
        msg.authorId === args.currentUserId
          ? msg.recipientName
          : msg.authorName;

      if (contactId && contactName && !contactsMap.has(contactId)) {
        contactsMap.set(contactId, {
          userId: contactId,
          userName: contactName,
          lastMessage: msg.content,
          timestamp: msg.timestamp,
        });
      }
    });

    return Array.from(contactsMap.values()).sort(
      (a, b) => b.timestamp - a.timestamp
    );
  },
});

export const sendMessage = mutation({
  args: {
    content: v.string(),
    teamId: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    messageType: v.optional(v.union(v.literal("general"), v.literal("direct"))),
    recipientId: v.optional(v.string()),
    recipientName: v.optional(v.string()),
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
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      content: args.content,
      teamId: args.teamId,
      authorId: args.authorId,
      authorName: args.authorName,
      timestamp: Date.now(),
      messageType: args.messageType || "general",
      recipientId: args.recipientId,
      recipientName: args.recipientName,
      reactions: [], // Initialize with empty reactions array
      // Campos para tarefas
      isTask: args.isTask,
      taskStatus: args.taskStatus,
      taskAssigneeId: args.taskAssigneeId,
      taskAssigneeName: args.taskAssigneeName,
      taskDueDate: args.taskDueDate,
      taskCreatedBy: args.taskCreatedBy,
    });
    return messageId;
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const respondToTask = mutation({
  args: {
    messageId: v.id("messages"),
    status: v.union(v.literal("accepted"), v.literal("rejected")),
    currentUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    // Verificar se a mensagem é uma tarefa
    if (!message.isTask) {
      throw new Error("Message is not a task");
    }

    // Verificar se o usuário atual é o responsável pela tarefa
    if (message.taskAssigneeId !== args.currentUserId) {
      throw new Error("Only the assigned user can respond to this task");
    }

    // Atualizar o status da tarefa na mensagem
    await ctx.db.patch(args.messageId, {
      taskStatus: args.status,
    });

    // Se aceita, criar a tarefa no sistema de tarefas
    if (args.status === "accepted") {
      await ctx.db.insert("tasks", {
        title: message.content,
        description: message.content,
        status: "todo" as const,
        assigneeId: message.taskAssigneeId!,
        assigneeName: message.taskAssigneeName!,
        createdBy: message.taskCreatedBy!,
        createdAt: Date.now(),
        dueDate: message.taskDueDate,
        originalMessage: message.content,
        teamId: message.teamId,
        priority: "medium" as const,
      });
    }

    return { success: true };
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
    messageType: v.optional(v.union(v.literal("general"), v.literal("direct"))),
    recipientId: v.optional(v.string()),
    recipientName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      content: `📎 ${args.fileName}`, // Default content for file messages
      teamId: args.teamId,
      authorId: args.authorId,
      authorName: args.authorName,
      timestamp: Date.now(),
      messageType: args.messageType || "general",
      recipientId: args.recipientId,
      recipientName: args.recipientName,
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

    // Helper function to get user display name
    const getDisplayName = (user: any) => {
      if (!user) return "Anonymous";

      // Try to get name from firstName and lastName
      const fullName = [user.firstName, user.lastName]
        .filter(Boolean)
        .join(" ");

      if (fullName.trim()) return fullName;

      // Fallback to email username
      if (user.email) {
        const emailUsername = user.email.split("@")[0];
        return emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1);
      }

      return "Anonymous";
    };

    // Get the author's display name
    const authorDisplayName = getDisplayName(messageAuthor);

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

// Function to clear chat messages
export const clearChat = mutation({
  args: {
    teamId: v.string(),
    messageType: v.optional(v.union(v.literal("general"), v.literal("direct"))),
    recipientId: v.optional(v.string()),
    currentUserId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get all messages to delete
    let query = ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("teamId"), args.teamId));

    if (args.messageType) {
      if (
        args.messageType === "direct" &&
        args.recipientId &&
        args.currentUserId
      ) {
        // For direct messages, only delete messages between these two users
        query = query.filter((q) =>
          q.and(
            q.eq(q.field("messageType"), "direct"),
            q.or(
              q.and(
                q.eq(q.field("authorId"), args.currentUserId),
                q.eq(q.field("recipientId"), args.recipientId)
              ),
              q.and(
                q.eq(q.field("authorId"), args.recipientId),
                q.eq(q.field("recipientId"), args.currentUserId)
              )
            )
          )
        );
      } else {
        query = query.filter((q) =>
          q.eq(q.field("messageType"), args.messageType)
        );
      }
    } else {
      // If no message type specified, clear general messages
      query = query.filter((q) =>
        q.or(
          q.eq(q.field("messageType"), "general"),
          q.eq(q.field("messageType"), undefined)
        )
      );
    }

    const messagesToDelete = await query.collect();

    // Delete all messages
    for (const message of messagesToDelete) {
      await ctx.db.delete(message._id);
    }

    return { deletedCount: messagesToDelete.length };
  },
});
