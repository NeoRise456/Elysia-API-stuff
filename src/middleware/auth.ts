import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";

export const authMiddleware = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
      schema: t.Object({
        userId: t.Number(),
      }),
    })
  )
  .derive(async ({ jwt, headers }) => {
    const authHeader = headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { userId: null };
    }
    const token = authHeader.slice(7);
    const payload = await jwt.verify(token);
    return { userId: payload ? payload.userId : null };
  });
