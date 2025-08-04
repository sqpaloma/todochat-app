import { components } from "./_generated/api";
import { Resend } from "@convex-dev/resend";
import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://chatdo.upcraftcrew.com/";

export const resend: Resend = new Resend(components.resend, {
  // Keep testMode as false to allow sending to real email addresses
  testMode: false,
});

export const sendNudgeEmail = internalMutation({
  args: {
    to: v.string(),
    toName: v.string(),
    fromName: v.string(),
    messageContent: v.optional(v.string()),
    messageId: v.id("messages"),
    teamName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const subject = `🔔 ${args.fromName} is calling you on TodoChat`;

    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 36px; font-weight: bold;">🔔</span>
            </div>
            <h1 style="color: #1e293b; margin: 0; font-size: 28px; font-weight: bold;">Someone is calling you!</h1>
            <p style="color: #64748b; margin: 10px 0 0 0; font-size: 16px;">${args.fromName} nudged you in a message</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); padding: 25px; border-radius: 16px; margin: 30px 0; text-align: center;">
            <p style="color: white; margin: 0; font-size: 18px; line-height: 1.5;">
              <strong>${args.fromName}</strong> nudged you in a message
            </p>
          </div>

          <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; border-left: 4px solid #7c3aed; margin: 30px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px;">Message:</h3>
            <p style="margin: 0; color: #64748b; font-style: italic; font-size: 14px; padding: 10px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0;">
              "${(args.messageContent || "").replace(/[<>&"']/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#x27;" })[char] || "")}"
            </p>
            ${args.teamName ? `<p style="margin: 10px 0 0 0; color: #7c3aed; font-size: 12px;">In: ${args.teamName}</p>` : ""}
          </div>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${appUrl}/chat" style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);">
              View Message
            </a>
          </div>

          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">You received this email because someone nudged you on TodoChat.</p>
          </div>
        </div>
      `;

      await resend.sendEmail(ctx, {
        from: "TodoChat <onboarding@chatdo.upcraftcrew.com>",
        to: args.to,
        subject,
        html,
      });

      await ctx.db.insert("emailAnalytics", {
        type: "nudge",
        to: args.to,
        subject,
        status: "sent",
        sentAt: Date.now(),
        messageId: args.messageId,
      });
    } catch (error) {
      await ctx.db.insert("emailAnalytics", {
        type: "nudge",
        to: args.to,
        status: "error",
        sentAt: Date.now(),
        error: String(error),
        messageId: args.messageId,
      });
      throw error;
    }
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
        from: "Acme <onboarding@chatdo.upcraftcrew.com>", // Using verified Resend domain for testing
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

export const sendTaskReminderBatch = internalMutation({
  args: {
    to: v.string(),
    assigneeName: v.string(),
    tasks: v.array(
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
    customMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const subject = `⏰ ${args.tasks.length} overdue task${args.tasks.length > 1 ? "s" : ""} need attention`;

    try {
      const tasksList = args.tasks
        .map((task) => {
          const priorityColor = {
            high: "#dc2626",
            medium: "#f59e0b",
            low: "#16a34a",
          }[task.priority || "medium"];

          const dueDateText = task.dueDate
            ? new Date(task.dueDate).toLocaleDateString("en-US")
            : null;

          return `
          <div style="margin: 10px 0; padding: 15px; background-color: #fef2f2; border-left: 4px solid ${priorityColor}; border-radius: 4px;">
            <strong style="color: #1e293b;">${task.title}</strong>
            ${task.description ? `<div style="color: #64748b; font-size: 14px; margin: 5px 0;">${task.description}</div>` : ""}
            ${dueDateText ? `<div style="color: #dc2626; font-size: 12px; margin: 5px 0; font-weight: bold;">📅 Was due: ${dueDateText}</div>` : ""}
            <div style="color: #6b7280; font-size: 11px;">Priority: ${(task.priority || "medium").toUpperCase()}</div>
          </div>
        `;
        })
        .join("");

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 36px; font-weight: bold;">⏰</span>
            </div>
            <h1 style="color: #1e293b; margin: 0; font-size: 28px; font-weight: bold;">Task Reminders</h1>
            <p style="color: #64748b; margin: 10px 0 0 0; font-size: 16px;">Hello ${args.assigneeName}!</p>
          </div>
          
          ${
            args.customMessage
              ? `
            <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; border-left: 4px solid #7c3aed; margin: 30px 0;">
              <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6;">${args.customMessage}</p>
            </div>
          `
              : ""
          }

          <div style="background-color: #fef3c7; padding: 25px; border-radius: 12px; border-left: 4px solid #f59e0b; margin: 30px 0;">
            <h3 style="color: #dc2626; margin: 0 0 15px 0;">🚨 Overdue Tasks (${args.tasks.length})</h3>
            <p style="margin: 0 0 15px 0; color: #92400e; font-size: 14px;">The following tasks are past their due date and need your attention:</p>
            ${tasksList}
          </div>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${appUrl}/tasks" style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);">
              View All Tasks
            </a>
          </div>

          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">Complete your overdue tasks to stay on track with your team's goals.</p>
          </div>
        </div>
      `;

      await resend.sendEmail(ctx, {
        from: "TodoChat <noreply@chatdo.upcraftcrew.com>",
        to: args.to,
        subject,
        html,
      });

      await ctx.db.insert("emailAnalytics", {
        type: "task_notification",
        to: args.to,
        subject,
        status: "sent",
        sentAt: Date.now(),
      });
    } catch (error) {
      await ctx.db.insert("emailAnalytics", {
        type: "task_notification",
        to: args.to,
        status: "error",
        sentAt: Date.now(),
        error: String(error),
      });
      throw error;
    }
  },
});

export const sendAnnouncementEmail = internalMutation({
  args: {
    to: v.string(),
    subject: v.string(),
    message: v.string(),
    fromName: v.string(),
    teamName: v.string(),
    recipientName: v.string(),
  },
  handler: async (ctx, args) => {
    const emailSubject = `📢 ${args.subject}`;

    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 36px; font-weight: bold;">📢</span>
            </div>
            <h1 style="color: #1e293b; margin: 0; font-size: 28px; font-weight: bold;">Team Announcement</h1>
            <p style="color: #64748b; margin: 10px 0 0 0; font-size: 16px;">Hello ${args.recipientName}!</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); padding: 25px; border-radius: 16px; margin: 30px 0; text-align: center;">
            <h2 style="color: white; margin: 0; font-size: 20px; font-weight: bold;">${args.subject}</h2>
            <p style="color: white; margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">From ${args.fromName} • ${args.teamName}</p>
          </div>

          <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; border-left: 4px solid #7c3aed; margin: 30px 0;">
            <div style="color: #1e293b; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${args.message}</div>
          </div>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${appUrl}/team" style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);">
              View Team
            </a>
          </div>

          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">This announcement was sent by ${args.fromName} to the ${args.teamName} team.</p>
          </div>
        </div>
      `;

      await resend.sendEmail(ctx, {
        from: "TodoChat <noreply@chatdo.upcraftcrew.com>",
        to: args.to,
        subject: emailSubject,
        html,
      });

      await ctx.db.insert("emailAnalytics", {
        type: "team_invitation",
        to: args.to,
        subject: emailSubject,
        status: "sent",
        sentAt: Date.now(),
      });
    } catch (error) {
      await ctx.db.insert("emailAnalytics", {
        type: "team_invitation",
        to: args.to,
        status: "error",
        sentAt: Date.now(),
        error: String(error),
      });
      throw error;
    }
  },
});

export const sendTaskNudgeEmail = internalMutation({
  args: {
    to: v.string(),
    toName: v.string(),
    fromName: v.string(),
    messageContent: v.string(),
    messageId: v.id("messages"),
    teamName: v.optional(v.string()),
    taskTitle: v.optional(v.string()),
    taskId: v.optional(v.id("tasks")),
  },
  handler: async (ctx, args) => {
    const subject = `📋 ${args.fromName} is calling you about a task on TodoChat`;

    try {
      const taskSection =
        args.taskTitle && args.taskId
          ? `
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px;">📋 Related Task:</h3>
          <p style="margin: 0; color: #92400e; font-weight: bold; font-size: 14px;">${args.taskTitle}</p>
          <a href="${appUrl}/tasks/${args.taskId}" style="color: #f59e0b; text-decoration: none; font-size: 12px; margin-top: 10px; display: inline-block;">
            View Task Details →
          </a>
        </div>
      `
          : "";

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 36px; font-weight: bold;">📋</span>
            </div>
            <h1 style="color: #1e293b; margin: 0; font-size: 28px; font-weight: bold;">Task Reminder!</h1>
            <p style="color: #64748b; margin: 10px 0 0 0; font-size: 16px;">${args.fromName} nudged you about a task</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); padding: 25px; border-radius: 16px; margin: 30px 0; text-align: center;">
            <p style="color: white; margin: 0; font-size: 18px; line-height: 1.5;">
              <strong>${args.fromName}</strong> is calling your attention to a task
            </p>
          </div>

          ${taskSection}

          <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; border-left: 4px solid #f59e0b; margin: 30px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px;">Message:</h3>
            <p style="margin: 0; color: #64748b; font-style: italic; font-size: 14px; padding: 10px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0;">
              "${args.messageContent.length > 100 ? args.messageContent.substring(0, 100) + "..." : args.messageContent}"
            </p>
            ${args.teamName ? `<p style="margin: 10px 0 0 0; color: #f59e0b; font-size: 12px;">In: ${args.teamName}</p>` : ""}
          </div>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${appUrl}/chat" style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);">
              View Message
            </a>
            ${
              args.taskId
                ? `
              <a href="${appUrl}/tasks/${args.taskId}" style="background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3); margin-left: 10px;">
                View Task
              </a>
            `
                : ""
            }
          </div>

          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">You received this email because someone nudged you about a task on TodoChat.</p>
          </div>
        </div>
      `;

      await resend.sendEmail(ctx, {
        from: "TodoChat <onboarding@chatdo.upcraftcrew.com>",
        to: args.to,
        subject,
        html,
      });

      await ctx.db.insert("emailAnalytics", {
        type: "task_notification",
        to: args.to,
        subject,
        status: "sent",
        sentAt: Date.now(),
        messageId: args.messageId,
        taskId: args.taskId,
      });
    } catch (error) {
      await ctx.db.insert("emailAnalytics", {
        type: "task_notification",
        to: args.to,
        status: "error",
        sentAt: Date.now(),
        error: String(error),
        messageId: args.messageId,
        taskId: args.taskId,
      });
      throw error;
    }
  },
});

export const sendOverdueTaskReminder = internalMutation({
  args: {
    to: v.string(),
    toName: v.string(),
    tasks: v.array(
      v.object({
        _id: v.id("tasks"),
        title: v.string(),
        description: v.string(),
        dueDate: v.number(),
        priority: v.union(
          v.literal("low"),
          v.literal("medium"),
          v.literal("high")
        ),
      })
    ),
    teamName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const subject = `⏰ You have ${args.tasks.length} overdue task${args.tasks.length > 1 ? "s" : ""} on TodoChat`;

    try {
      const tasksList = args.tasks
        .map((task) => {
          const priorityColor =
            task.priority === "high"
              ? "#ef4444"
              : task.priority === "medium"
                ? "#f59e0b"
                : "#10b981";
          const priorityText =
            task.priority === "high"
              ? "🔴 High"
              : task.priority === "medium"
                ? "🟡 Medium"
                : "🟢 Low";

          return `
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid ${priorityColor}; margin: 10px 0;">
            <h4 style="margin: 0 0 5px 0; color: #1e293b; font-size: 14px;">${task.title}</h4>
            <p style="margin: 0 0 5px 0; color: #64748b; font-size: 12px;">${task.description}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: ${priorityColor}; font-size: 11px; font-weight: bold;">${priorityText}</span>
              <span style="color: #ef4444; font-size: 11px; font-weight: bold;">
                Due: ${new Date(task.dueDate).toLocaleDateString("en-US")}
              </span>
            </div>
          </div>
        `;
        })
        .join("");

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 36px; font-weight: bold;">⏰</span>
            </div>
            <h1 style="color: #1e293b; margin: 0; font-size: 28px; font-weight: bold;">Overdue Tasks Alert!</h1>
            <p style="color: #64748b; margin: 10px 0 0 0; font-size: 16px;">Hello ${args.toName}, you have ${args.tasks.length} overdue task${args.tasks.length > 1 ? "s" : ""}</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 25px; border-radius: 16px; margin: 30px 0; text-align: center;">
            <p style="color: white; margin: 0; font-size: 18px; line-height: 1.5;">
              <strong>${args.tasks.length} task${args.tasks.length > 1 ? "s" : ""} past due date</strong>
            </p>
            ${args.teamName ? `<p style="color: white; margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">In: ${args.teamName}</p>` : ""}
          </div>

          <div style="margin: 30px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px;">Overdue Tasks:</h3>
            ${tasksList}
          </div>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${appUrl}/tasks" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);">
              View All Tasks
            </a>
          </div>

          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">Please complete these tasks to stay on track with your team's goals.</p>
          </div>
        </div>
      `;

      await resend.sendEmail(ctx, {
        from: "TodoChat <onboarding@chatdo.upcraftcrew.com>",
        to: args.to,
        subject,
        html,
      });

      await ctx.db.insert("emailAnalytics", {
        type: "task_notification",
        to: args.to,
        subject,
        status: "sent",
        sentAt: Date.now(),
      });
    } catch (error) {
      await ctx.db.insert("emailAnalytics", {
        type: "task_notification",
        to: args.to,
        status: "error",
        sentAt: Date.now(),
        error: String(error),
      });
      throw error;
    }
  },
});
