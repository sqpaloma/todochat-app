import type React from "react";
import "./globals.css";
import { ConvexClientProvider } from "./convex-provider";
import { ConditionalAuthHeader } from "@/components/conditional-auth-header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-jakarta">
        <ConvexClientProvider>
          <ConditionalAuthHeader />
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: "Chat do ✨ - Transforme conversas em resultados",
  description:
    "A ferramenta mais divertida para transformar suas conversas em tarefas organizadas. Sua equipe vai amar a produtividade gamificada!",
};
