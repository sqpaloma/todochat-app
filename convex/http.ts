import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { resend } from "./emails";
import { internal } from "./_generated/api";
import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";

const http = httpRouter();

// Webhook endpoint para receber eventos do Resend
http.route({
  path: "/resend-webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    return await resend.handleResendEventWebhook(ctx, req);
  }),
});

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const event = await validateRequest(request);
      if (!event) {
        console.error("Failed to validate Clerk webhook request");
        return new Response("Error occurred", { status: 400 });
      }
      switch (event.type) {
        case "user.created": {
          console.log("User created event:", event.data);
          console.log("User created event type:", event.type);
          console.log(
            "User created event data structure:",
            JSON.stringify(event.data, null, 2)
          );

          // Create user and get the ID back
          const userId = await ctx.runMutation(internal.users.upsertFromClerk, {
            data: event.data,
          });

          if (!userId) {
            throw new Error("User not created");
          }
          console.log("User created successfully:", userId);
        }
        case "user.updated":
          console.log("User updated event:", event.data);
          console.log("User updated event type:", event.type);
          console.log(
            "User updated event data structure:",
            JSON.stringify(event.data, null, 2)
          );

          await ctx.runMutation(internal.users.upsertFromClerk, {
            data: event.data,
          });
          console.log("User updated successfully");
          break;

        case "user.deleted": {
          const clerkUserId = event.data.id!;
          await ctx.runMutation(internal.users.deleteFromClerk, {
            clerkUserId,
          });
          break;
        }
        default:
          console.log("Ignored Clerk webhook event", event.type);
      }

      return new Response(null, { status: 200 });
    } catch (error) {
      console.error("Error processing Clerk webhook:", error);
      return new Response("Internal server error", { status: 500 });
    }
  }),
});

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  console.log("Validating Clerk webhook request");
  const payloadString = await req.text();
  console.log("Webhook payload:", payloadString);

  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  console.log("Svix headers:", svixHeaders);

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  try {
    const event = wh.verify(
      payloadString,
      svixHeaders
    ) as unknown as WebhookEvent;
    console.log("Verified webhook event:", event);
    return event;
  } catch (error) {
    console.error("Error verifying webhook event", error);
    return null;
  }
}

export default http;
