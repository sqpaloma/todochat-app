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
    const subject = `🔔 ${args.fromName} is calling you on ChatDo`;

    try {
      const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="background: linear-gradient(135deg, #00D2FF 0%, #3A47D5 100%); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(58, 71, 213, 0.3);">
              <span style="color: black; font-size: 36px; font-weight: bold;">🔔</span>
            </div>
            <h1 style="color: #1a202c; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Someone's calling you!</h1>
            <p style="color: #718096; margin: 15px 0 0 0; font-size: 18px; font-weight: 400;">${args.fromName} nudged you in ChatDo</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #00D2FF 0%, #3A47D5 100%); padding: 30px; border-radius: 20px; margin: 30px 0; text-align: center; box-shadow: 0 10px 40px rgba(58, 71, 213, 0.2);">
            <p style="color: black; margin: 0; font-size: 20px; line-height: 1.6; font-weight: 500;">
              <strong style="font-weight: 700;">${args.fromName}</strong> nudged you in a message
            </p>
          </div>

          <div style="background: linear-gradient(145deg, #f7fafc 0%, #edf2f7 100%); padding: 30px; border-radius: 16px; border-left: 5px solid #3A47D5; margin: 30px 0; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
            <h3 style="margin: 0 0 15px 0; color: #2d3748; font-size: 18px; font-weight: 600;">💬 Message:</h3>
            <p style="margin: 0; color: #4a5568; font-style: italic; font-size: 16px; padding: 20px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; line-height: 1.6; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);">
              "${(args.messageContent || "").replace(/[<>&"']/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#x27;" })[char] || "")}"
            </p>
            ${args.teamName ? `<p style="margin: 15px 0 0 0; color: #3A47D5; font-size: 14px; font-weight: 600;">📁 In: ${args.teamName}</p>` : ""}
          </div>

          <div style="text-align: center; margin: 50px 0;">
            <a href="${appUrl}/chat" style="background: linear-gradient(135deg, #00D2FF 0%, #3A47D5 100%); color: black; padding: 18px 40px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: 700; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 8px 30px rgba(58, 71, 213, 0.4); transition: all 0.3s ease; border: none;">
              View Message
            </a>
          </div>

          <div style="text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid #e2e8f0;">
            <div style="margin-bottom: 15px;">
              <span style="color: #3A47D5; font-size: 24px; font-weight: 700;">ChatDo</span>
            </div>
            <p style="color: #718096; font-size: 13px; margin: 0; line-height: 1.5;">You received this email because someone nudged you on ChatDo.<br>Stay connected with your team in real-time.</p>
          </div>
        </div>
      `;

      await resend.sendEmail(ctx, {
        from: "ChatDo <onboarding@chatdo.upcraftcrew.com>",
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
        from: "ChatDo <onboarding@chatdo.upcraftcrew.com>",
        to: args.to,
        subject: `🎉 You're invited to join ${args.teamName || "our team"} on ChatDo`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 40px;">
                          <div style="background: linear-gradient(135deg, #00D2FF 0%, #3A47D5 100%); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(58, 71, 213, 0.3);">
              <span style="color: black; font-size: 36px; font-weight: bold;">👥</span>
            </div>
              <h1 style="color: #1a202c; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">You're Invited!</h1>
              <p style="color: #718096; margin: 15px 0 0 0; font-size: 18px; font-weight: 400;">Join your team on ChatDo</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #00D2FF 0%, #3A47D5 100%); padding: 30px; border-radius: 20px; margin: 30px 0; text-align: center; box-shadow: 0 10px 40px rgba(58, 71, 213, 0.2);">
              <p style="color: black; margin: 0; font-size: 20px; line-height: 1.6; font-weight: 500;">
                <strong style="font-weight: 700;">${args.inviterName}</strong> has invited you to join<br>
                <span style="font-size: 24px; font-weight: 700; margin-top: 8px; display: block;">${args.teamName || "the team"}</span>
              </p>
            </div>

            <div style="background: linear-gradient(145deg, #f7fafc 0%, #edf2f7 100%); padding: 30px; border-radius: 16px; border-left: 5px solid #3A47D5; margin: 30px 0; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
              <h3 style="margin: 0 0 20px 0; color: #2d3748; font-size: 22px; font-weight: 700;">Welcome to ChatDo! 🚀</h3>
              <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.7;">
                ChatDo is your team's collaborative workspace for seamless communication and task management. 
                Here's what you can do:
              </p>
              <div style="margin: 20px 0;">
                <div style="display: flex; align-items: center; margin: 12px 0; padding: 12px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);">
                  <span style="color: #3A47D5; font-size: 18px; margin-right: 12px;">💬</span>
                  <span style="color: #4a5568; font-size: 15px;">Chat with your team members in real-time</span>
                </div>
                <div style="display: flex; align-items: center; margin: 12px 0; padding: 12px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);">
                  <span style="color: #3A47D5; font-size: 18px; margin-right: 12px;">✅</span>
                  <span style="color: #4a5568; font-size: 15px;">Create and manage tasks collaboratively</span>
                </div>
                <div style="display: flex; align-items: center; margin: 12px 0; padding: 12px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);">
                  <span style="color: #3A47D5; font-size: 18px; margin-right: 12px;">📊</span>
                  <span style="color: #4a5568; font-size: 15px;">Track project progress and deadlines</span>
                </div>
                <div style="display: flex; align-items: center; margin: 12px 0; padding: 12px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);">
                  <span style="color: #3A47D5; font-size: 18px; margin-right: 12px;">🔔</span>
                  <span style="color: #4a5568; font-size: 15px;">Get notified about important updates</span>
                </div>
              </div>
            </div>

            <div style="text-align: center; margin: 50px 0;">
              <a href="${joinUrl}" 
                 style="background: linear-gradient(135deg, #00D2FF 0%, #3A47D5 100%); color: black; padding: 18px 40px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: 700; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 8px 30px rgba(58, 71, 213, 0.4);">
                Join Team Now
              </a>
            </div>

            <div style="background: linear-gradient(135deg, #fef5e7 0%, #fed7aa 20%); padding: 25px; border-radius: 16px; border-left: 5px solid #f59e0b; margin: 30px 0; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.1);">
              <p style="margin: 0; color: #92400e; font-size: 15px; line-height: 1.6;">
                <strong style="font-weight: 700;">⏰ Getting Started:</strong><br>
                Click the button above to create your account and join the team. 
                If you already have an account, just sign in and you'll be automatically added to the team.
              </p>
            </div>

            <div style="text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid #e2e8f0;">
              <div style="margin-bottom: 15px;">
                <span style="color: #3A47D5; font-size: 24px; font-weight: 700;">ChatDo</span>
              </div>
              <p style="color: #718096; font-size: 13px; margin: 0 0 8px 0; line-height: 1.5;">
                You received this invitation because ${args.inviterName} added your email to their ChatDo team.
              </p>
              <p style="color: #a0aec0; font-size: 12px; margin: 0;">
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
      ? `<br><small style="color: #dc2626; font-weight: 600;">📅 Due: ${new Date(args.dueDate).toLocaleDateString("en-US")}</small>`
      : "";

    await resend.sendEmail(ctx, {
      from: "ChatDo <noreply@chatdo.upcraftcrew.com>",
      to: args.to,
      subject: `📋 New Task Assigned: ${args.taskTitle}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="background: linear-gradient(135deg, #00D2FF 0%, #3A47D5 100%); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(58, 71, 213, 0.3);">
              <span style="color: black; font-size: 36px; font-weight: bold;">📋</span>
            </div>
            <h1 style="color: #1a202c; margin: 0; font-size: 28px; font-weight: 700;">New Task Created</h1>
            <p style="color: #718096; margin: 15px 0 0 0; font-size: 16px;">Hello ${args.assigneeName}!</p>
          </div>
          
          <div style="background: linear-gradient(145deg, #f7fafc 0%, #edf2f7 100%); padding: 30px; border-radius: 16px; border-left: 5px solid #3A47D5; margin: 30px 0; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
            <h3 style="margin: 0 0 15px 0; color: #2d3748; font-size: 20px; font-weight: 700;">${args.taskTitle}</h3>
            ${args.description ? `<p style="margin: 15px 0; color: #4a5568; font-size: 15px; line-height: 1.6;">${args.description}</p>` : ""}
            ${dueDateText}
            <p style="margin: 15px 0 0 0; color: #718096; font-size: 14px;">
              👤 Created by: <strong>${args.createdBy}</strong>
            </p>
          </div>

          <div style="text-align: center; margin: 40px 0; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
            <a href="${appUrl}/tasks/${args.taskId}" 
               style="background: linear-gradient(135deg, #00D2FF 0%, #3A47D5 100%); color: black; padding: 14px 28px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: 600; font-size: 14px; box-shadow: 0 4px 20px rgba(58, 71, 213, 0.3);">
              View Task
            </a>
            <a href="${appUrl}/api/tasks/${args.taskId}/complete" 
               style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: black; padding: 14px 28px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: 600; font-size: 14px; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);">
              Mark as Completed
            </a>
          </div>

          <div style="text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid #e2e8f0;">
            <div style="margin-bottom: 15px;">
              <span style="color: #3A47D5; font-size: 24px; font-weight: 700;">ChatDo</span>
            </div>
            <p style="color: #718096; font-size: 13px; margin: 0;">Stay productive with your team on ChatDo</p>
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
          low: "#10b981",
        }[task.priority || "medium"];

        const priorityIcon = {
          high: "🔴",
          medium: "🟡",
          low: "🟢",
        }[task.priority || "medium"];

        const dueDateText = task.dueDate
          ? `<br><small style="color: #dc2626; font-weight: 600;">📅 Due: ${new Date(task.dueDate).toLocaleDateString("en-US")}</small>`
          : "";

        return `
          <li style="margin: 15px 0; padding: 20px; background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%); border-left: 4px solid ${priorityColor}; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);">
            <strong style="color: #2d3748; font-size: 16px;">${task.title}</strong>
            ${task.description ? `<br><span style="color: #4a5568; font-size: 14px; line-height: 1.5; margin-top: 8px; display: block;">${task.description}</span>` : ""}
            ${dueDateText}
            <br><small style="color: #718096; font-size: 12px; margin-top: 8px; display: block;">${priorityIcon} Priority: ${(task.priority || "medium").toUpperCase()}</small>
          </li>
        `;
      })
      .join("");

    await resend.sendEmail(ctx, {
      from: "ChatDo Daily <digest@chatdo.upcraftcrew.com>",
      to: args.memberEmail,
      subject: `📋 Daily Summary - ${args.memberTasks.length} pending tasks`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="background: linear-gradient(135deg, #00D2FF 0%, #3A47D5 100%); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(58, 71, 213, 0.3);">
              <span style="color: black; font-size: 36px; font-weight: bold;">📋</span>
            </div>
            <h1 style="color: #1a202c; margin: 0; font-size: 28px; font-weight: 700;">Daily Summary</h1>
            <p style="color: #718096; margin: 15px 0 0 0; font-size: 16px;">Hello ${args.memberName}!</p>
          </div>
          
          <div style="margin: 30px 0;">
            <h3 style="color: #dc2626; font-size: 20px; font-weight: 700; margin: 0 0 20px 0;">🔴 Pending Tasks (${args.memberTasks.length})</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${tasksList}
            </ul>
          </div>

          ${
            args.completedTasksCount > 0
              ? `
            <div style="margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 16px; border-left: 5px solid #10b981; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.1);">
              <h3 style="color: #065f46; margin: 0 0 10px 0; font-size: 18px; font-weight: 700;">✅ Completed Today (${args.completedTasksCount})</h3>
              <p style="color: #047857; margin: 0; font-size: 15px;">Congratulations on your progress! 🎉</p>
            </div>
          `
              : ""
          }

          <div style="text-align: center; margin: 50px 0;">
            <a href="${appUrl}" 
               style="background: linear-gradient(135deg, #00D2FF 0%, #3A47D5 100%); color: black; padding: 18px 40px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: 700; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 8px 30px rgba(58, 71, 213, 0.4);">
              Open ChatDo
            </a>
          </div>

          <div style="text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid #e2e8f0;">
            <div style="margin-bottom: 15px;">
              <span style="color: #3A47D5; font-size: 24px; font-weight: 700;">ChatDo</span>
            </div>
            <p style="color: #718096; font-size: 13px; margin: 0;">This summary is sent automatically every day. To change your preferences, access ChatDo settings.</p>
          </div>
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
        from: "ChatDo <noreply@chatdo.upcraftcrew.com>",
        to: email,
        subject: `✅ Task Completed: ${args.taskTitle}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);">
                <span style="color: black; font-size: 36px; font-weight: bold;">✅</span>
              </div>
              <h1 style="color: #1a202c; margin: 0; font-size: 28px; font-weight: 700;">Task Completed</h1>
            </div>
            
            <div style="margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-left: 5px solid #10b981; border-radius: 16px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.1);">
              <h3 style="margin: 0 0 15px 0; color: #065f46; font-size: 18px; font-weight: 700;">${args.taskTitle}</h3>
              <p style="margin: 0; color: #047857; font-size: 15px; font-weight: 600;">
                ✨ Completed by: ${args.completedBy}
              </p>
            </div>

            <div style="text-align: center; margin: 50px 0;">
              <a href="${appUrl}/tasks/${args.taskId}" 
                 style="background: linear-gradient(135deg, #00D2FF 0%, #3A47D5 100%); color: black; padding: 18px 40px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: 700; font-size: 16px; box-shadow: 0 8px 30px rgba(58, 71, 213, 0.4);">
                View Details
              </a>
            </div>

            <div style="text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid #e2e8f0;">
              <div style="margin-bottom: 15px;">
                <span style="color: #3A47D5; font-size: 24px; font-weight: 700;">ChatDo</span>
              </div>
              <p style="color: #718096; font-size: 13px; margin: 0;">Great job on completing this task! Keep up the momentum.</p>
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
            low: "#10b981",
          }[task.priority || "medium"];

          const priorityIcon = {
            high: "🔴",
            medium: "🟡",
            low: "🟢",
          }[task.priority || "medium"];

          const dueDateText = task.dueDate
            ? new Date(task.dueDate).toLocaleDateString("en-US")
            : null;

          return `
          <div style="margin: 15px 0; padding: 20px; background: linear-gradient(145deg, #ffffff 0%, #fef2f2 100%); border-left: 4px solid ${priorityColor}; border-radius: 12px; box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);">
            <strong style="color: #2d3748; font-size: 16px; display: block; margin-bottom: 8px;">${task.title}</strong>
            ${task.description ? `<div style="color: #4a5568; font-size: 14px; margin: 8px 0; line-height: 1.5;">${task.description}</div>` : ""}
            ${dueDateText ? `<div style="color: #dc2626; font-size: 13px; margin: 8px 0; font-weight: 600; background-color: #fef2f2; padding: 6px 10px; border-radius: 6px; display: inline-block;">📅 Was due: ${dueDateText}</div>` : ""}
            <div style="color: #718096; font-size: 12px; margin-top: 8px;">${priorityIcon} Priority: ${(task.priority || "medium").toUpperCase()}</div>
          </div>
        `;
        })
        .join("");

      const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(220, 38, 38, 0.3);">
              <span style="color: black; font-size: 36px; font-weight: bold;">⏰</span>
            </div>
            <h1 style="color: #1a202c; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Task Reminders</h1>
            <p style="color: #718096; margin: 15px 0 0 0; font-size: 18px; font-weight: 400;">Hello ${args.assigneeName}!</p>
          </div>
          
          ${
            args.customMessage
              ? `
            <div style="background: linear-gradient(145deg, #f7fafc 0%, #edf2f7 100%); padding: 25px; border-radius: 16px; border-left: 5px solid #3A47D5; margin: 30px 0; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
              <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.7;">${args.customMessage}</p>
            </div>
          `
              : ""
          }

          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); padding: 30px; border-radius: 16px; border-left: 5px solid #f59e0b; margin: 30px 0; box-shadow: 0 6px 25px rgba(245, 158, 11, 0.15);">
            <h3 style="color: #dc2626; margin: 0 0 20px 0; font-size: 22px; font-weight: 700;">🚨 Overdue Tasks (${args.tasks.length})</h3>
            <p style="margin: 0 0 20px 0; color: #92400e; font-size: 15px; line-height: 1.6;">The following tasks are past their due date and need your attention:</p>
            ${tasksList}
          </div>

          <div style="text-align: center; margin: 50px 0;">
            <a href="${appUrl}/tasks" style="background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); color: black; padding: 18px 40px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: 700; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 8px 30px rgba(220, 38, 38, 0.4);">
              View All Tasks
            </a>
          </div>

          <div style="text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid #e2e8f0;">
            <div style="margin-bottom: 15px;">
              <span style="color: #3A47D5; font-size: 24px; font-weight: 700;">ChatDo</span>
            </div>
            <p style="color: #718096; font-size: 13px; margin: 0; line-height: 1.5;">Complete your overdue tasks to stay on track with your team's goals.</p>
          </div>
        </div>
      `;

      await resend.sendEmail(ctx, {
        from: "ChatDo <noreply@chatdo.upcraftcrew.com>",
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
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="background: linear-gradient(135deg, #00D2FF 0%, #3A47D5 100%); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(58, 71, 213, 0.3);">
              <span style="color: black; font-size: 36px; font-weight: bold;">📢</span>
            </div>
            <h1 style="color: #1a202c; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Team Announcement</h1>
            <p style="color: #718096; margin: 15px 0 0 0; font-size: 18px; font-weight: 400;">Hello ${args.recipientName}!</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #00D2FF 0%, #3A47D5 100%); padding: 30px; border-radius: 20px; margin: 30px 0; text-align: center; box-shadow: 0 10px 40px rgba(58, 71, 213, 0.2);">
            <h2 style="color: black; margin: 0; font-size: 24px; font-weight: 700; margin-bottom: 8px;">${args.subject}</h2>
            <p style="color: black; margin: 0; font-size: 16px; opacity: 0.9;">From ${args.fromName} • ${args.teamName}</p>
          </div>

          <div style="background: linear-gradient(145deg, #f7fafc 0%, #edf2f7 100%); padding: 30px; border-radius: 16px; border-left: 5px solid #3A47D5; margin: 30px 0; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
            <div style="color: #2d3748; font-size: 16px; line-height: 1.7; white-space: pre-wrap;">${args.message}</div>
          </div>

          <div style="text-align: center; margin: 50px 0;">
            <a href="${appUrl}/team" style="background: linear-gradient(135deg, #00D2FF 0%, #3A47D5 100%); color: black; padding: 18px 40px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: 700; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 8px 30px rgba(58, 71, 213, 0.4);">
              View Team
            </a>
          </div>

          <div style="text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid #e2e8f0;">
            <div style="margin-bottom: 15px;">
              <span style="color: #3A47D5; font-size: 24px; font-weight: 700;">ChatDo</span>
            </div>
            <p style="color: #718096; font-size: 13px; margin: 0;">This announcement was sent by ${args.fromName} to the ${args.teamName} team.</p>
          </div>
        </div>
      `;

      await resend.sendEmail(ctx, {
        from: "ChatDo <noreply@chatdo.upcraftcrew.com>",
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
    const subject = `📋 ${args.fromName} is calling you about a task on ChatDo`;

    try {
      const taskSection =
        args.taskTitle && args.taskId
          ? `
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); padding: 25px; border-radius: 16px; border-left: 5px solid #f59e0b; margin: 25px 0; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.1);">
          <h3 style="margin: 0 0 12px 0; color: #92400e; font-size: 18px; font-weight: 700;">📋 Related Task:</h3>
          <p style="margin: 0; color: #92400e; font-weight: 600; font-size: 16px;">${args.taskTitle}</p>
          <a href="${appUrl}/tasks/${args.taskId}" style="color: #f59e0b; text-decoration: none; font-size: 14px; margin-top: 12px; display: inline-block; font-weight: 600;">
            View Task Details →
          </a>
        </div>
      `
          : "";

      const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(239, 68, 68, 0.3);">
              <span style="color: black; font-size: 36px; font-weight: bold;">📋</span>
            </div>
            <h1 style="color: #1a202c; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Task Reminder!</h1>
            <p style="color: #718096; margin: 15px 0 0 0; font-size: 18px; font-weight: 400;">${args.fromName} nudged you about a task</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); padding: 30px; border-radius: 20px; margin: 30px 0; text-align: center; box-shadow: 0 10px 40px rgba(239, 68, 68, 0.2);">
            <p style="color: black; margin: 0; font-size: 20px; line-height: 1.6; font-weight: 500;">
              <strong style="font-weight: 700;">${args.fromName}</strong> is calling your attention to a task
            </p>
          </div>

          ${taskSection}

          <div style="background: linear-gradient(145deg, #f7fafc 0%, #edf2f7 100%); padding: 30px; border-radius: 16px; border-left: 5px solid #f59e0b; margin: 30px 0; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
            <h3 style="margin: 0 0 15px 0; color: #2d3748; font-size: 18px; font-weight: 600;">💬 Message:</h3>
            <p style="margin: 0; color: #4a5568; font-style: italic; font-size: 16px; padding: 20px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; line-height: 1.6; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);">
              "${args.messageContent.length > 100 ? args.messageContent.substring(0, 100) + "..." : args.messageContent}"
            </p>
            ${args.teamName ? `<p style="margin: 15px 0 0 0; color: #f59e0b; font-size: 14px; font-weight: 600;">📁 In: ${args.teamName}</p>` : ""}
          </div>

          <div style="text-align: center; margin: 50px 0; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
            <a href="${appUrl}/chat" style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: black; padding: 16px 32px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 6px 25px rgba(245, 158, 11, 0.4);">
              View Message
            </a>
            ${
              args.taskId
                ? `
              <a href="${appUrl}/tasks/${args.taskId}" style="background: linear-gradient(135deg, #00D2FF 0%, #3A47D5 100%); color: black; padding: 16px 32px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 6px 25px rgba(58, 71, 213, 0.4);">
                View Task
              </a>
            `
                : ""
            }
          </div>

          <div style="text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid #e2e8f0;">
            <div style="margin-bottom: 15px;">
              <span style="color: #3A47D5; font-size: 24px; font-weight: 700;">ChatDo</span>
            </div>
            <p style="color: #718096; font-size: 13px; margin: 0;">You received this email because someone nudged you about a task on ChatDo.</p>
          </div>
        </div>
      `;

      await resend.sendEmail(ctx, {
        from: "ChatDo <onboarding@chatdo.upcraftcrew.com>",
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
    const subject = `⏰ You have ${args.tasks.length} overdue task${args.tasks.length > 1 ? "s" : ""} on ChatDo`;

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
          <div style="background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%); padding: 20px; border-radius: 12px; border-left: 4px solid ${priorityColor}; margin: 15px 0; box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);">
            <h4 style="margin: 0 0 8px 0; color: #2d3748; font-size: 16px; font-weight: 600;">${task.title}</h4>
            <p style="margin: 0 0 12px 0; color: #4a5568; font-size: 14px; line-height: 1.5;">${task.description}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <span style="color: ${priorityColor}; font-size: 12px; font-weight: 700; background-color: rgba(${priorityColor === "#ef4444" ? "239, 68, 68" : priorityColor === "#f59e0b" ? "245, 158, 11" : "16, 185, 129"}, 0.1); padding: 4px 8px; border-radius: 6px;">${priorityText}</span>
              <span style="color: #ef4444; font-size: 12px; font-weight: 600; background-color: #fef2f2; padding: 4px 8px; border-radius: 6px;">
                📅 Due: ${new Date(task.dueDate).toLocaleDateString("en-US")}
              </span>
            </div>
          </div>
        `;
        })
        .join("");

      const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(220, 38, 38, 0.3);">
              <span style="color: black; font-size: 36px; font-weight: bold;">⏰</span>
            </div>
            <h1 style="color: #1a202c; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Overdue Tasks Alert!</h1>
            <p style="color: #718096; margin: 15px 0 0 0; font-size: 18px; font-weight: 400;">Hello ${args.toName}, you have ${args.tasks.length} overdue task${args.tasks.length > 1 ? "s" : ""}</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; border-radius: 20px; margin: 30px 0; text-align: center; box-shadow: 0 10px 40px rgba(220, 38, 38, 0.2);">
            <p style="color: black; margin: 0; font-size: 20px; line-height: 1.6; font-weight: 600;">
              <strong style="font-weight: 700;">${args.tasks.length} task${args.tasks.length > 1 ? "s" : ""} past due date</strong>
            </p>
            ${args.teamName ? `<p style="color: black; margin: 12px 0 0 0; font-size: 16px; opacity: 0.9;">In: ${args.teamName}</p>` : ""}
          </div>

          <div style="margin: 30px 0;">
            <h3 style="margin: 0 0 20px 0; color: #2d3748; font-size: 22px; font-weight: 700;">📋 Overdue Tasks:</h3>
            ${tasksList}
          </div>

          <div style="text-align: center; margin: 50px 0;">
            <a href="${appUrl}/tasks" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: black; padding: 18px 40px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: 700; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 8px 30px rgba(220, 38, 38, 0.4);">
              View All Tasks
            </a>
          </div>

          <div style="text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid #e2e8f0;">
            <div style="margin-bottom: 15px;">
              <span style="color: #3A47D5; font-size: 24px; font-weight: 700;">ChatDo</span>
            </div>
            <p style="color: #718096; font-size: 13px; margin: 0; line-height: 1.5;">Please complete these tasks to stay on track with your team's goals.</p>
          </div>
        </div>
      `;

      await resend.sendEmail(ctx, {
        from: "ChatDo <onboarding@chatdo.upcraftcrew.com>",
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
