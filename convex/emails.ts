import { components } from "./_generated/api";
import { Resend } from "@convex-dev/resend";
import { internalMutation, internalAction } from "./_generated/server";
import { v } from "convex/values";

export const resend: Resend = new Resend(components.resend, {
  // Keep testMode as false to allow sending to real email addresses
  testMode: false,
});

// Function to send nudge email
export const sendNudgeEmail = internalMutation({
  args: {
    to: v.string(),
    toName: v.string(),
    fromName: v.string(),
    messageContent: v.string(),
    messageId: v.id("messages"),
    teamName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://chatdo.upcraftcrew.com/";

    await resend.sendEmail(ctx, {
      from: "Acme <onboarding@resend.dev>",
      to: args.to,
      subject: `🔔 ${args.fromName} is calling you on TodoChat`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #7c3aed; margin: 0; font-size: 28px;">🔔</h1>
            <h2 style="color: #7c3aed; margin: 10px 0;">Someone is calling you!</h2>
          </div>
          
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); padding: 20px; border-radius: 12px; margin: 20px 0;">
            <p style="color: white; margin: 0; text-align: center; font-size: 18px;">
              <strong>${args.fromName}</strong> nudged you in a message
            </p>
          </div>

          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #7c3aed; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px;">Message:</h3>
            <p style="margin: 0; color: #64748b; font-style: italic; font-size: 14px;">
              "${args.messageContent.length > 100 ? args.messageContent.substring(0, 100) + "..." : args.messageContent}"
            </p>
            ${
              args.teamName
                ? `<p style="margin: 10px 0 0 0; color: #7c3aed; font-size: 12px;">
              In: ${args.teamName}
            </p>`
                : ""
            }
            <p style="margin: 10px 0 0 0; color: #7c3aed; font-size: 12px;">
              To: ${args.toName} (${args.to})
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${appUrl}/chat" 
               style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
              View Message
            </a>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">
              You received this email because someone nudged you on TodoChat.
            </p>
            <p style="color: #dc2626; font-size: 10px; margin: 5px 0 0 0;">
              [TEST MODE] This email was sent to delivered@resend.dev for testing
            </p>
          </div>
        </div>
      `,
    });
  },
});

// Function to send team invitation email
export const sendTeamInvitationEmail = internalMutation({
  args: {
    to: v.string(),
    inviteeName: v.string(),
    inviterName: v.string(),
    teamName: v.optional(v.string()),
    teamId: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("🚀 sendTeamInvitationEmail called with:", {
      to: args.to,
      inviteeName: args.inviteeName,
      inviterName: args.inviterName,
      teamName: args.teamName,
      teamId: args.teamId,
    });

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://chatdo.upcraftcrew.com/";
    const joinUrl = `${appUrl}/join?team=${args.teamId}&email=${encodeURIComponent(args.to)}`;

    try {
      await resend.sendEmail(ctx, {
        from: "Acme <onboarding@resend.dev>", // Using verified Resend domain for testing
        to: args.to,
        subject: `🎉 You're invited to join ${args.teamName || "our team"} on TodoChat`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 36px; font-weight: bold;">👥</span>
              </div>
              <h1 style="color: #1e293b; margin: 0; font-size: 28px; font-weight: bold;">You're Invited!</h1>
              <p style="color: #64748b; margin: 10px 0 0 0; font-size: 16px;">Join your team on TodoChat</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); padding: 25px; border-radius: 16px; margin: 30px 0; text-align: center;">
              <p style="color: white; margin: 0; font-size: 18px; line-height: 1.5;">
                <strong>${args.inviterName}</strong> has invited you to join<br>
                <span style="font-size: 20px; font-weight: bold;">${args.teamName || "the team"}</span>
              </p>
            </div>

            <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; border-left: 4px solid #7c3aed; margin: 30px 0;">
              <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px;">Welcome to TodoChat!</h3>
              <p style="margin: 0 0 15px 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                TodoChat is a collaborative platform where teams can chat, manage tasks, and stay organized. 
                You'll be able to:
              </p>
              <ul style="margin: 0; padding-left: 20px; color: #64748b; font-size: 14px; line-height: 1.6;">
                <li>Chat with your team members in real-time</li>
                <li>Create and manage tasks collaboratively</li>
                <li>Track project progress and deadlines</li>
                <li>Get notified about important updates</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 40px 0;">
              <a href="${joinUrl}" 
                 style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);">
                Join Team Now
              </a>
            </div>

            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 30px 0;">
              <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                <strong>⏰ Getting Started:</strong><br>
                Click the button above to create your account and join the team. 
                If you already have an account, just sign in and you'll be automatically added to the team.
              </p>
            </div>

            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 12px; margin: 0 0 5px 0;">
                You received this invitation because ${args.inviterName} added your email to their TodoChat team.
              </p>
              <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                If you don't want to join this team, you can safely ignore this email.
              </p>
            </div>
          </div>
        `,
      });

      console.log("✅ Email sent successfully to:", args.to);
    } catch (error) {
      console.error("❌ Error sending email:", error);
      throw error;
    }
  },
});

// Function to send new task notification email
export const sendTaskNotificationEmail = internalMutation({
  args: {
    to: v.string(),
    taskId: v.id("tasks"),
    taskTitle: v.string(),
    assigneeName: v.string(),
    createdBy: v.string(),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://chatdo.upcraftcrew.com/";

    const dueDateText = args.dueDate
      ? `<br><small style="color: #dc2626;">Due: ${new Date(args.dueDate).toLocaleDateString("en-US")}</small>`
      : "";

    await resend.sendEmail(ctx, {
      from: "TodoChat <noreply@todochat.com>",
      to: args.to,
      subject: `New Task Assigned: ${args.taskTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">📋 New Task Created</h2>
          <p>Hello ${args.assigneeName}!</p>
          
          <div style="margin: 20px 0; padding: 20px; background-color: #f8fafc; border-left: 4px solid #2563eb; border-radius: 8px;">
            <h3 style="margin: 0 0 10px 0; color: #1e293b;">${args.taskTitle}</h3>
            ${args.description ? `<p style="margin: 10px 0; color: #64748b;">${args.description}</p>` : ""}
            ${dueDateText}
            <p style="margin: 10px 0 0 0; color: #64748b; font-size: 14px;">
              Created by: ${args.createdBy}
            </p>
          </div>

          <div style="margin: 20px 0; padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
            <a href="${appUrl}/tasks/${args.taskId}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Task
            </a>
            <a href="${appUrl}/api/tasks/${args.taskId}/complete" 
               style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-left: 10px;">
              Mark as Completed
            </a>
          </div>
        </div>
      `,
    });
  },
});

// Function to send daily digest
export const sendDailyDigest = internalMutation({
  args: {
    memberEmail: v.string(),
    memberName: v.string(),
    memberTasks: v.array(
      v.object({
        _id: v.id("tasks"),
        title: v.string(),
        description: v.optional(v.string()),
        dueDate: v.optional(v.number()),
        priority: v.optional(
          v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
        ),
      })
    ),
    completedTasksCount: v.number(),
  },
  handler: async (ctx, args) => {
    if (args.memberTasks.length === 0) return;

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://chatdo.upcraftcrew.com/";

    const tasksList = args.memberTasks
      .map((task) => {
        const priorityColor = {
          high: "#dc2626",
          medium: "#f59e0b",
          low: "#16a34a",
        }[task.priority || "medium"];

        const dueDateText = task.dueDate
          ? `<br><small style="color: #dc2626;">Due: ${new Date(task.dueDate).toLocaleDateString("en-US")}</small>`
          : "";

        return `
          <li style="margin: 10px 0; padding: 15px; background-color: #fef2f2; border-left: 4px solid ${priorityColor}; border-radius: 4px;">
            <strong>${task.title}</strong>
            ${task.description ? `<br><span style="color: #64748b;">${task.description}</span>` : ""}
            ${dueDateText}
            <br><small style="color: #6b7280;">Priority: ${(task.priority || "medium").toUpperCase()}</small>
          </li>
        `;
      })
      .join("");

    await resend.sendEmail(ctx, {
      from: "TodoChat Daily <digest@todochat.com>",
      to: args.memberEmail,
      subject: `📋 Daily Summary - ${args.memberTasks.length} pending tasks`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">📋 Daily Summary - TodoChat</h2>
          <p>Hello ${args.memberName}!</p>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #dc2626;">🔴 Pending Tasks (${args.memberTasks.length})</h3>
            <ul style="list-style: none; padding: 0;">
              ${tasksList}
            </ul>
          </div>

          ${
            args.completedTasksCount > 0
              ? `
            <div style="margin: 20px 0; padding: 15px; background-color: #f0fdf4; border-radius: 8px;">
              <h3 style="color: #16a34a; margin: 0 0 10px 0;">✅ Completed Today (${args.completedTasksCount})</h3>
              <p style="color: #6b7280; margin: 0;">Congratulations on your progress! 🎉</p>
            </div>
          `
              : ""
          }

          <div style="margin: 20px 0; padding: 20px; background-color: #f3f4f6; border-radius: 8px; text-align: center;">
            <a href="${appUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Open TodoChat
            </a>
          </div>

          <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 20px;">
            This summary is sent automatically every day. To change your preferences, access TodoChat settings.
          </p>
        </div>
      `,
    });
  },
});

// Function to send task completion email
export const sendTaskCompletionEmail = internalMutation({
  args: {
    taskId: v.id("tasks"),
    taskTitle: v.string(),
    completedBy: v.string(),
    teamMemberEmails: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://chatdo.upcraftcrew.com/";

    // Send to all team members
    for (const email of args.teamMemberEmails) {
      await resend.sendEmail(ctx, {
        from: "TodoChat <noreply@todochat.com>",
        to: email,
        subject: `✅ Task Completed: ${args.taskTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #16a34a;">✅ Task Completed</h2>
            
            <div style="margin: 20px 0; padding: 20px; background-color: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 8px;">
              <h3 style="margin: 0 0 10px 0; color: #15803d;">${args.taskTitle}</h3>
              <p style="margin: 10px 0 0 0; color: #16a34a; font-size: 14px;">
                ✨ Completed by: ${args.completedBy}
              </p>
            </div>

            <div style="margin: 20px 0; padding: 20px; background-color: #f3f4f6; border-radius: 8px; text-align: center;">
              <a href="${appUrl}/tasks/${args.taskId}" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View Details
              </a>
            </div>
          </div>
        `,
      });
    }
  },
});
