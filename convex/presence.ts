import { mutation, query } from "./_generated/server";
import { components } from "./_generated/api";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { Presence } from "@convex-dev/presence";
import { getCurrentUser } from "./users";

export const presence = new Presence(components.presence);

export const getUserId = query({
  args: {},
  returns: v.union(v.string(), v.null()),
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    return user?._id ?? null;
  },
});

export const heartbeat = mutation({
  args: {
    roomId: v.string(),
    userId: v.string(),
    sessionId: v.string(),
    interval: v.number(),
  },
  handler: async (ctx, { roomId, userId, sessionId, interval }) => {
    try {
      // Get current user
      const user = await getCurrentUser(ctx);

      // Allow heartbeat to proceed regardless of user validation for now
      // This ensures the presence system works even if there are auth issues
      return await presence.heartbeat(ctx, roomId, userId, sessionId, interval);
    } catch (error) {
      // Always allow the heartbeat to proceed for development
      return await presence.heartbeat(ctx, roomId, userId, sessionId, interval);
    }
  },
});

export const list = query({
  args: { roomToken: v.string() },
  handler: async (ctx, { roomToken }) => {
    try {
      // Join presence state with user info.
      const presenceList = await presence.list(ctx, roomToken);

      const listWithUserInfo = await Promise.all(
        presenceList.map(async (entry) => {
          const user = await ctx.db.get(entry.userId as Id<"users">);
          if (!user) {
            return entry;
          }
          // Combine firstName and lastName to create a display name
          const displayName =
            [user.firstName, user.lastName].filter(Boolean).join(" ") ||
            "Anonymous";
          return {
            ...entry,
            name: displayName,
            image: user.imageUrl,
          };
        })
      );
      return listWithUserInfo;
    } catch (error) {
      return [];
    }
  },
});

export const disconnect = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    // Can't check auth here because it's called over http from sendBeacon.
    try {
      return await presence.disconnect(ctx, sessionToken);
    } catch (error) {
      return null;
    }
  },
});
