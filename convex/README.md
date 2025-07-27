# TodoChat - Convex Backend

This is the TodoChat backend built with Convex, including Resend integration for email sending.

## Resend Configuration

The project uses the official [@convex-dev/resend](https://www.convex.dev/components/resend) component for sending emails.

### Required Environment Variables

Configure the following variables in your Convex deployment:

```bash
# Resend API Key (required)
RESEND_API_KEY=re_your_api_key_here

# Resend Webhook Secret (optional, but recommended for production)
RESEND_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Application URL (for links in emails)
NEXT_PUBLIC_APP_URL=https://your-app-url.com
```

### How to Configure

1. **Get Resend API Key:**

   - Go to [resend.com](https://resend.com)
   - Create an account and get your API key
   - Configure in Convex: `npx convex env set RESEND_API_KEY re_your_key_here`

2. **Configure Webhook (Recommended):**

   - In the Resend dashboard, create a webhook for: `https://your-convex-site.convex.site/resend-webhook`
   - Enable all `email.*` events
   - Configure the secret: `npx convex env set RESEND_WEBHOOK_SECRET whsec_your_secret_here`

3. **Application URL:**
   - `npx convex env set NEXT_PUBLIC_APP_URL https://your-app-url.com`

## Email Features

### ✉️ Task Notifications

- Automatic email when a new task is created
- Includes task details, deadline, and action buttons
- Sent to the task assignee

### 📋 Daily Summary

- Daily email with pending tasks for each member
- Sent automatically via cron job
- Includes count of completed tasks

### ✅ Completion Notifications

- Email when a task is marked as completed
- Sent to all team members

### 🗑️ Automatic Cleanup

- Automatically removes old emails
- Finalized emails: removed after 7 days
- Abandoned emails: removed after 4 weeks

## Main Files

- `emails.ts` - Email sending functions using Resend
- `tasks.ts` - Task management with notifications
- `teams.ts` - Team management and daily summaries
- `crons.ts` - Scheduled jobs for emails and cleanup
- `convex.config.ts` - Resend component configuration

## Convex Functions

A query function that takes two arguments looks like:

```ts
// convex/myFunctions.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const myQueryFunction = query({
  // Validators for arguments.
  args: {
    first: v.number(),
    second: v.string(),
  },

  // Function implementation.
  handler: async (ctx, args) => {
    // Read the database as many times as you need here.
    // See https://docs.convex.dev/database/reading-data.
    const documents = await ctx.db.query("tablename").collect();

    // Arguments passed from the client are properties of the args object.
    console.log(args.first, args.second);

    // Write arbitrary JavaScript here: filter, aggregate, build derived data,
    // remove non-public properties, or create new objects.
    return documents;
  },
});
```

Using this query function in a React component looks like:

```ts
const data = useQuery(api.myFunctions.myQueryFunction, {
  first: 10,
  second: "hello",
});
```

A mutation function looks like:

```ts
// convex/myFunctions.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const myMutationFunction = mutation({
  // Validators for arguments.
  args: {
    first: v.string(),
    second: v.string(),
  },

  // Function implementation.
  handler: async (ctx, args) => {
    // Insert or modify documents in the database here.
    // Mutations can also read from the database like queries.
    // See https://docs.convex.dev/database/writing-data.
    const message = { body: args.first, author: args.second };
    const id = await ctx.db.insert("messages", message);

    // Optionally, return a value from your mutation.
    return await ctx.db.get(id);
  },
});
```

Using this mutation function in a React component looks like:

```ts
const mutation = useMutation(api.myFunctions.myMutationFunction);
function handleButtonPress() {
  // fire and forget, the most common way to use mutations
  mutation({ first: "Hello!", second: "me" });
  // OR
  // use the result once the mutation has completed
  mutation({ first: "Hello!", second: "me" }).then((result) =>
    console.log(result)
  );
}
```

Use the Convex CLI to push your functions to a deployment. See everything
the Convex CLI can do by running `npx convex -h` in your project root
directory. To learn more, launch the docs with `npx convex docs`.
