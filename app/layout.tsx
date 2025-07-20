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
  generator: "v0.dev",
};
