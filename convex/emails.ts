import { components } from "./_generated/api";
import { Resend } from "@convex-dev/resend";
import { internalMutation, internalAction } from "./_generated/server";
import { v } from "convex/values";

export const resend: Resend = new Resend(components.resend, {
  // Manter testMode como false para permitir envio para endereços reais
  testMode: false,
});

// Função para enviar nudge por email
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
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    await resend.sendEmail(ctx, {
      from: "Acme <onboarding@resend.dev>",
      to: "paloma.sq@hotmail.com", //args.to, refactor to use args.to after testing
      subject: `🔔 ${args.fromName} está te chamando no TodoChat`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #7c3aed; margin: 0; font-size: 28px;">🔔</h1>
            <h2 style="color: #7c3aed; margin: 10px 0;">Alguém está te chamando!</h2>
          </div>
          
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); padding: 20px; border-radius: 12px; margin: 20px 0;">
            <p style="color: white; margin: 0; text-align: center; font-size: 18px;">
              <strong>${args.fromName}</strong> te cutucou em uma mensagem
            </p>
          </div>

          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #7c3aed; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px;">Mensagem:</h3>
            <p style="margin: 0; color: #64748b; font-style: italic; font-size: 14px;">
              "${args.messageContent.length > 100 ? args.messageContent.substring(0, 100) + "..." : args.messageContent}"
            </p>
            ${
              args.teamName
                ? `<p style="margin: 10px 0 0 0; color: #7c3aed; font-size: 12px;">
              Em: ${args.teamName}
            </p>`
                : ""
            }
            <p style="margin: 10px 0 0 0; color: #7c3aed; font-size: 12px;">
              Para: ${args.toName} (${args.to})
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${appUrl}/chat" 
               style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
              Ver Mensagem
            </a>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">
              Você recebeu este email porque alguém te cutucou no TodoChat.
            </p>
            <p style="color: #dc2626; font-size: 10px; margin: 5px 0 0 0;">
              [TEST MODE] Este email foi enviado para delivered@resend.dev para testes
            </p>
          </div>
        </div>
      `,
    });
  },
});

// Função para enviar email de nova tarefa
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
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const dueDateText = args.dueDate
      ? `<br><small style="color: #dc2626;">Prazo: ${new Date(args.dueDate).toLocaleDateString("pt-BR")}</small>`
      : "";

    await resend.sendEmail(ctx, {
      from: "TodoChat <noreply@todochat.com>",
      to: args.to,
      subject: `Nova Tarefa Atribuída: ${args.taskTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">📋 Nova Tarefa Criada</h2>
          <p>Olá ${args.assigneeName}!</p>
          
          <div style="margin: 20px 0; padding: 20px; background-color: #f8fafc; border-left: 4px solid #2563eb; border-radius: 8px;">
            <h3 style="margin: 0 0 10px 0; color: #1e293b;">${args.taskTitle}</h3>
            ${args.description ? `<p style="margin: 10px 0; color: #64748b;">${args.description}</p>` : ""}
            ${dueDateText}
            <p style="margin: 10px 0 0 0; color: #64748b; font-size: 14px;">
              Criada por: ${args.createdBy}
            </p>
          </div>

          <div style="margin: 20px 0; padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
            <a href="${appUrl}/tasks/${args.taskId}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Ver Tarefa
            </a>
            <a href="${appUrl}/api/tasks/${args.taskId}/complete" 
               style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-left: 10px;">
              Marcar como Concluída
            </a>
          </div>
        </div>
      `,
    });
  },
});

// Função para enviar resumo diário
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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const tasksList = args.memberTasks
      .map((task) => {
        const priorityColor = {
          high: "#dc2626",
          medium: "#f59e0b",
          low: "#16a34a",
        }[task.priority || "medium"];

        const dueDateText = task.dueDate
          ? `<br><small style="color: #dc2626;">Vence em: ${new Date(task.dueDate).toLocaleDateString("pt-BR")}</small>`
          : "";

        return `
          <li style="margin: 10px 0; padding: 15px; background-color: #fef2f2; border-left: 4px solid ${priorityColor}; border-radius: 4px;">
            <strong>${task.title}</strong>
            ${task.description ? `<br><span style="color: #64748b;">${task.description}</span>` : ""}
            ${dueDateText}
            <br><small style="color: #6b7280;">Prioridade: ${(task.priority || "medium").toUpperCase()}</small>
          </li>
        `;
      })
      .join("");

    await resend.sendEmail(ctx, {
      from: "TodoChat Daily <digest@todochat.com>",
      to: args.memberEmail,
      subject: `📋 Resumo Diário - ${args.memberTasks.length} tarefas pendentes`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">📋 Resumo Diário - TodoChat</h2>
          <p>Olá ${args.memberName}!</p>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #dc2626;">🔴 Tarefas Pendentes (${args.memberTasks.length})</h3>
            <ul style="list-style: none; padding: 0;">
              ${tasksList}
            </ul>
          </div>

          ${
            args.completedTasksCount > 0
              ? `
            <div style="margin: 20px 0; padding: 15px; background-color: #f0fdf4; border-radius: 8px;">
              <h3 style="color: #16a34a; margin: 0 0 10px 0;">✅ Concluídas Hoje (${args.completedTasksCount})</h3>
              <p style="color: #6b7280; margin: 0;">Parabéns pelo progresso! 🎉</p>
            </div>
          `
              : ""
          }

          <div style="margin: 20px 0; padding: 20px; background-color: #f3f4f6; border-radius: 8px; text-align: center;">
            <a href="${appUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Abrir TodoChat
            </a>
          </div>

          <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 20px;">
            Este resumo é enviado automaticamente todos os dias. Para alterar suas preferências, acesse as configurações do TodoChat.
          </p>
        </div>
      `,
    });
  },
});

// Função para enviar email de tarefa concluída
export const sendTaskCompletionEmail = internalMutation({
  args: {
    taskId: v.id("tasks"),
    taskTitle: v.string(),
    completedBy: v.string(),
    teamMemberEmails: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Enviar para todos os membros da equipe
    for (const email of args.teamMemberEmails) {
      await resend.sendEmail(ctx, {
        from: "TodoChat <noreply@todochat.com>",
        to: email,
        subject: `✅ Tarefa Concluída: ${args.taskTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #16a34a;">✅ Tarefa Concluída</h2>
            
            <div style="margin: 20px 0; padding: 20px; background-color: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 8px;">
              <h3 style="margin: 0 0 10px 0; color: #15803d;">${args.taskTitle}</h3>
              <p style="margin: 10px 0 0 0; color: #16a34a; font-size: 14px;">
                ✨ Concluída por: ${args.completedBy}
              </p>
            </div>

            <div style="margin: 20px 0; padding: 20px; background-color: #f3f4f6; border-radius: 8px; text-align: center;">
              <a href="${appUrl}/tasks/${args.taskId}" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Ver Detalhes
              </a>
            </div>
          </div>
        `,
      });
    }
  },
});
