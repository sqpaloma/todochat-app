import { cronJobs } from "convex/server";
import { internalMutation } from "./_generated/server";

const crons = cronJobs();

/* // Enviar resumo diário todos os dias às 9h da manhã
crons.interval(
  "Enviar resumo diario para todos os membros da equipe",
  { hours: 24 }, // A cada 24 horas
  "teams:sendDailyDigestToTeam" as any,
  { teamId: "team-1" } // ID da equipe padrão
);

// Limpar emails antigos a cada hora
crons.interval(
  "Limpar emails antigos do componente Resend",
  { hours: 1 },
  "crons:cleanupOldEmails" as any
); */

/* // Função para limpar emails antigos
export const cleanupOldEmails = internalMutation({
  args: {},
  handler: async (ctx) => {
    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

    // Limpar emails finalizados com mais de 1 semana
    await ctx.scheduler.runAfter(0, "resend:cleanupOldEmails" as any, {
      olderThan: ONE_WEEK_MS,
    });

    // Limpar emails abandonados com mais de 4 semanas (geralmente indicam bug)
    await ctx.scheduler.runAfter(0, "resend:cleanupAbandonedEmails" as any, {
      olderThan: 4 * ONE_WEEK_MS,
    });
  },
}); */

export default crons;
