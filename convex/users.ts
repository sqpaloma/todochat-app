import { UserJSON } from "@clerk/backend";
import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";
import { ConvexError, v, Validator } from "convex/values";

export const current = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    return user;
  },
});

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }

  const user = await userByClerkUserId(ctx, identity.subject);
  return user;
}

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

async function userByClerkUserId(ctx: QueryCtx, clerkUserId: string) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkUserId")
    .filter((q) => q.eq(q.field("clerkUserId"), clerkUserId))
    .unique();
  return user;
}

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> },
  async handler(ctx, { data }) {
    console.log("Upserting user from Clerk:", data);
    console.log("Full Clerk data structure:", JSON.stringify(data, null, 2));

    // Ensure we have email addresses
    if (!data.email_addresses || data.email_addresses.length === 0) {
      console.error("No email addresses found in Clerk data");
      return null;
    }

    // Check for different possible name fields
    console.log("Available name fields in Clerk data:");
    console.log("- first_name:", data.first_name);
    console.log("- last_name:", data.last_name);
    console.log("- name:", (data as any).name);
    console.log("- username:", (data as any).username);
    console.log("- full_name:", (data as any).full_name);

    const userAttributes = {
      email: data.email_addresses[0].email_address,
      clerkUserId: data.id,
      firstName:
        data.first_name ?? (data as any).name?.split(" ")[0] ?? undefined,
      lastName:
        data.last_name ??
        (data as any).name?.split(" ").slice(1).join(" ") ??
        undefined,
      imageUrl: data.image_url ?? undefined,
    };

    console.log("User attributes:", userAttributes);

    const user = await userByClerkUserId(ctx, data.id);
    if (user === null) {
      const newUser = await ctx.db.insert("users", userAttributes);
      console.log("Created new user:", newUser);
      return newUser;
    } else {
      await ctx.db.patch(user._id, userAttributes);
      console.log("Updated existing user:", user._id);
      return user._id;
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, { clerkUserId }) => {
    const user = await userByClerkUserId(ctx, clerkUserId);

    if (user) {
      await ctx.db.delete(user._id);
    } else {
      throw new ConvexError("User not found");
    }
  },
});

// Debug function to check all users in the database
export const debugUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});

// Query to list all users
export const list = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});

// Debug function to check current user identity
export const debugCurrentUserIdentity = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log("Current user identity:", identity);
    return identity;
  },
});

// Debug function to create test users
export const createTestUsers = mutation({
  args: {},
  handler: async (ctx) => {
    const existingUsers = await ctx.db.query("users").collect();

    if (existingUsers.length === 0) {
      console.log("Creating test users...");

      const testUsers = [
        {
          email: "joao@test.com",
          clerkUserId: "test_joao",
          firstName: "João",
          lastName: "Silva",
          imageUrl: undefined,
        },
        {
          email: "maria@test.com",
          clerkUserId: "test_maria",
          firstName: "Maria",
          lastName: "Santos",
          imageUrl: undefined,
        },
        {
          email: "pedro@test.com",
          clerkUserId: "test_pedro",
          firstName: "Pedro",
          lastName: "Oliveira",
          imageUrl: undefined,
        },
      ];

      const createdUsers = [];
      for (const userData of testUsers) {
        const userId = await ctx.db.insert("users", userData);
        createdUsers.push(userId);
      }

      console.log("Created test users:", createdUsers);
      return createdUsers;
    } else {
      console.log("Users already exist:", existingUsers.length);
      return existingUsers.map((u) => u._id);
    }
  },
});
