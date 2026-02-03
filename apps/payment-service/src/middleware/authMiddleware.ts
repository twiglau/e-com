import { createMiddleware } from "hono/factory";
import { getAuth } from "@hono/clerk-auth";
import type { CustomJwtSessionClaims } from "@repo/types";

export const shouldBeUser = createMiddleware<{ Variables: { userId: string } }>(
  async (c, next) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
      return c.json({ message: "You are not logged in" }, 401);
    }

    c.set("userId", auth.userId);

    await next();
  },
);

export const shouldBeAdmin = createMiddleware<{
  Variables: { userId: string };
}>(async (c, next) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({ message: "You are not logged in" }, 401);
  }

  const sessionClaims = auth.sessionClaims as CustomJwtSessionClaims;
  if (sessionClaims?.metadata?.role !== "admin") {
    return c.json({ message: "You are not authorized" }, 403);
  }

  c.set("userId", auth.userId);

  await next();
});
