import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: NextRequest) {
  try {
    // Check if Resend is properly configured
    if (!resend) {
      return NextResponse.json(
        {
          error:
            "Email service not configured. Please set RESEND_API_KEY environment variable.",
        },
        { status: 500 }
      );
    }

    const { to, subject, html, taskId } = await request.json();

    const { data, error } = await resend.emails.send({
      from: "TodoChat <noreply@todochat.com>",
      to: [to],
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Nova Tarefa Criada</h2>
          ${html}
          <div style="margin: 20px 0; padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/tasks/${taskId}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Ver Tarefa
            </a>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/tasks/${taskId}/complete" 
               style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-left: 10px;">
              Marcar como Concluída
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            Você pode responder a este email com "done" para marcar a tarefa como concluída.
          </p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
