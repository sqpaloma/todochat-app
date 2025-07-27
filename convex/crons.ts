import { cronJobs } from "convex/server";
import { internalMutation } from "./_generated/server";

const crons = cronJobs();

/* // Send daily summary every day at 9am
crons.interval(
  "Send daily summary to all team members",
  { hours: 24 }, // Every 24 hours
  "teams:sendDailyDigestToTeam" as any,
  { teamId: "team-1" } // Default team ID
);

// Clean up old emails every hour
crons.interval(
  "Clean up old emails from Resend component",
  { hours: 1 },
  "crons:cleanupOldEmails" as any
); */

/* // Function to clean up old emails
export const cleanupOldEmails = internalMutation({
  args: {},
  handler: async (ctx) => {
    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

    // Clean up completed emails older than 1 week
    await ctx.scheduler.runAfter(0, "resend:cleanupOldEmails" as any, {
      olderThan: ONE_WEEK_MS,
    });

    // Clean up abandoned emails older than 4 weeks (usually indicates a bug)
    await ctx.scheduler.runAfter(0, "resend:cleanupAbandonedEmails" as any, {
      olderThan: 4 * ONE_WEEK_MS,
    });
  },
}); */

export default crons;
