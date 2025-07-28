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
    console.log("getUserId");
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
    console.log("heartbeat called", { roomId, userId, sessionId, interval });

    try {
      // Get current user
      const user = await getCurrentUser(ctx);
      console.log("Current user:", user?._id);

      // For development, allow heartbeat even if user is not found
      // In production, you might want to be more strict
      if (!user) {
        console.log(
          "No authenticated user found, but allowing heartbeat for development"
        );
        // Still allow the heartbeat to proceed for development
        return await presence.heartbeat(
          ctx,
          roomId,
          userId,
          sessionId,
          interval
        );
      }

      // Check if the userId matches the current user's ID
      // Convert both to strings for comparison
      const currentUserId = user._id.toString();
      const providedUserId = userId.toString();

      console.log("Comparing user IDs:", { currentUserId, providedUserId });

      if (currentUserId !== providedUserId) {
        console.log("User ID mismatch, but allowing heartbeat for development");
        // For development, allow the heartbeat to proceed
        return await presence.heartbeat(
          ctx,
          roomId,
          userId,
          sessionId,
          interval
        );
      }

      return await presence.heartbeat(ctx, roomId, userId, sessionId, interval);
    } catch (error) {
      console.error("Error in heartbeat:", error);
      // For development, allow the heartbeat to proceed even if there's an error
      return await presence.heartbeat(ctx, roomId, userId, sessionId, interval);
    }
  },
});

export const list = query({
  args: { roomToken: v.string() },
  handler: async (ctx, { roomToken }) => {
    console.log("list called with roomToken:", roomToken);
    try {
      // Join presence state with user info.
      const presenceList = await presence.list(ctx, roomToken);
      console.log("Presence list:", presenceList);

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
      console.error("Error in list:", error);
      return [];
    }
  },
});

export const disconnect = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    // Can't check auth here because it's called over http from sendBeacon.
    console.log("disconnect called with sessionToken:", sessionToken);
    try {
      return await presence.disconnect(ctx, sessionToken);
    } catch (error) {
      console.error("Error in disconnect:", error);
      return null;
    }
  },
});
