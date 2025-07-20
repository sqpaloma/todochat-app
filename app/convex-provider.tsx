"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "http://localhost:3001";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  console.warn(
    "⚠️  NEXT_PUBLIC_CONVEX_URL not set. Falling back to http://localhost:3001.\n" +
      "If Convex dev isn't running, start it with `npx convex dev` or set NEXT_PUBLIC_CONVEX_URL."
  );
}

const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
