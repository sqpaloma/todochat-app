import { defineApp } from "convex/server";
import resend from "@convex-dev/resend/convex.config";
import presence from "@convex-dev/presence/convex.config";

const app = defineApp();

app.use(resend);
app.use(presence);

export default app;
