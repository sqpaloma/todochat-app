import type React from "react";
import "./globals.css";
import { ConvexClientProvider } from "./convex-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
        />
        <meta
          name="description"
          content="Chat do - A ferramenta mais divertida para transformar conversas em tarefas organizadas"
        />
        <meta
          name="keywords"
          content="chat, tasks, produtividade, equipe, colaboração"
        />
        <meta name="theme-color" content="#8b5cf6" />
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
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: "Chat do ✨ - Transforme conversas em resultados",
  description:
    "A ferramenta mais divertida para transformar suas conversas em tarefas organizadas. Sua equipe vai amar a produtividade gamificada!",
  generator: "v0.dev",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=5.0",
  themeColor: "#8b5cf6",
};
