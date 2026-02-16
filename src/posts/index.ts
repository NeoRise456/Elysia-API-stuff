import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { db } from "../db";

export const postRoutes = new Elysia({ prefix: "/posts" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
      schema: t.Object({
        userId: t.Number(),
      }),
    })
  )
  .post(
    "/",
    async ({ body, jwt, headers, set }) => {
      const authHeader = headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        set.status = 401;
        return { error: "Unauthorized" };
      }
      const token = authHeader.slice(7);
      const payload = await jwt.verify(token);
      if (!payload) {
        set.status = 401;
        return { error: "Unauthorized" };
      }
      const post = await db.post.create({
        data: {
          title: body.title,
          description: body.description,
          userId: payload.userId,
        },
      });
      return { id: post.id, title: post.title, description: post.description };
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.String(),
      }),
      detail: {
        summary: "Create a new post",
        tags: ["Posts"],
        security: [{ bearerAuth: [] }],
      },
    }
  )
  .get(
    "/",
    async ({ headers, jwt, set }) => {
      const authHeader = headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        set.status = 401;
        return { error: "Unauthorized" };
      }
      const token = authHeader.slice(7);
      const payload = await jwt.verify(token);
      if (!payload) {
        set.status = 401;
        return { error: "Unauthorized" };
      }
      const posts = await db.post.findMany({
        where: { userId: payload.userId },
      });
      return posts;
    },
    {
      detail: {
        summary: "Get all posts for authenticated user",
        tags: ["Posts"],
        security: [{ bearerAuth: [] }],
      },
    }
  );
