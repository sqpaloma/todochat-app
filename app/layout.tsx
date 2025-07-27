import type React from "react";
import "./globals.css";
import { ConvexClientProvider } from "./convex-provider";
import { LayoutWrapper } from "./layout-wrapper";

export const metadata = {
  title: "Chat Do ✨ - Transform conversations into incredible results",
  description:
    "The most fun tool to transform your conversations into organized tasks. Your team will love gamified productivity!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
          <LayoutWrapper>{children}</LayoutWrapper>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
