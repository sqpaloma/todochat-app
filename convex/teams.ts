import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";
import { internal } from "./_generated/api";

export const getTeamMembers = query({
  args: { teamId: v.string() },
  handler: async (ctx, args) => {
    // Fetch all users registered in the system
    const users = await ctx.db.query("users").collect();

    // Return formatted users for the team component
    return users.map((user) => ({
      _id: user._id,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
      email: user.email,
      status: "online" as const, // In a real implementation, this would come from a presence system
      role: "member", // In a real implementation, this would come from the team-user relationship
      joinDate: user._creationTime,
      phone: undefined, // Field doesn't exist in current user structure
      location: undefined, // Field doesn't exist in current user structure
      imageUrl: user.imageUrl,
    }));
  },
});

export const addMember = mutation({
  args: {
    teamId: v.string(),
    email: v.string(),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Verify that the current user has permission (must be authenticated)
    const currentUser = await getCurrentUserOrThrow(ctx);

    // Get inviter's name for the email
    const inviterName =
      `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() ||
      currentUser.email;

    // Send invitation email - user doesn't need to exist in system yet
    await ctx.scheduler.runAfter(0, internal.emails.sendTeamInvitationEmail, {
      to: args.email,
      inviteeName: args.email.split("@")[0], // Use email prefix as name placeholder
      inviterName: inviterName,
      teamName: "TodoChat Team", // You can make this dynamic later
      teamId: args.teamId,
    });

    return {
      success: true,
      message: `Invitation sent successfully to ${args.email}. They will receive an email with instructions to join the team.`,
    };
  },
});

// Function to send daily digest to all team members
export const sendDailyDigestToTeam = internalMutation({
  args: {
    teamId: v.string(),
  },
  handler: async (ctx, args) => {
    // Fetch all registered users (in a real implementation, only team members)
    const members = await ctx.db.query("users").collect();

    // Fetch all team tasks
    const allTasks = await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("teamId"), args.teamId))
      .collect();

    // Tasks completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const completedToday = allTasks.filter(
      (task) => task.status === "done" && task._creationTime >= today.getTime()
    );

    // Send digest to each member
    for (const member of members) {
      const memberTasks = allTasks.filter(
        (task) => task.assigneeId === member._id && task.status !== "done"
      );

      if (memberTasks.length > 0) {
        await ctx.scheduler.runAfter(0, "emails:sendDailyDigest" as any, {
          memberEmail: member.email,
          memberName:
            `${member.firstName || ""} ${member.lastName || ""}`.trim() ||
            "User",
          memberTasks: memberTasks.map((task) => ({
            _id: task._id,
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
          })),
          completedTasksCount: completedToday.length,
        });
      }
    }

    return { sent: members.length };
  },
});
