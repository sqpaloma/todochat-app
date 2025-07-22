import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    // Check if Resend is properly configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Email service not configured. Please set RESEND_API_KEY environment variable.",
        },
        { status: 500 }
      );
    }

    // Initialize Resend only when needed and API key is available
    const resend = new Resend(process.env.RESEND_API_KEY);

    // This would be called by a cron job or Convex scheduled function
    const { teamId, tasks, members } = await request.json();

    const pendingTasks = tasks.filter((task: any) => task.status !== "done");
    const completedTasks = tasks.filter((task: any) => task.status === "done");

    for (const member of members) {
      const memberTasks = pendingTasks.filter(
        (task: any) => task.assigneeId === member._id
      );

      if (memberTasks.length === 0) continue;

      const { data, error } = await resend.emails.send({
        from: "TodoChat Daily <digest@todochat.com>",
        to: [member.email],
        subject: `📋 Resumo Diário - ${memberTasks.length} tarefas pendentes`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">📋 Resumo Diário - TodoChat</h2>
            <p>Olá ${member.name}!</p>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #dc2626;">🔴 Tarefas Pendentes (${memberTasks.length})</h3>
              <ul>
                ${memberTasks
                  .map(
                    (task: any) => `
                  <li style="margin: 10px 0; padding: 10px; background-color: #fef2f2; border-left: 4px solid #dc2626;">
                    <strong>${task.title}</strong>
                    ${task.dueDate ? `<br><small>Vence em: ${new Date(task.dueDate).toLocaleDateString("pt-BR")}</small>` : ""}
                  </li>
                `
                  )
                  .join("")}
              </ul>
            </div>

            <div style="margin: 20px 0;">
              <h3 style="color: #16a34a;">✅ Concluídas Hoje (${completedTasks.length})</h3>
              <p style="color: #6b7280;">Parabéns pelo progresso!</p>
            </div>

            <div style="margin: 20px 0; padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Abrir TodoChat
              </a>
            </div>
          </div>
        `,
      });

      if (error) {
        console.error("Error sending digest to", member.email, error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send daily digest" },
      { status: 500 }
    );
  }
}
