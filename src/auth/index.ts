import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { swagger } from "@elysiajs/swagger";
import { db } from "../db";
import * as bcrypt from "bcrypt";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
      schema: t.Object({
        userId: t.Number(),
      }),
    })
  )
  .use(swagger())
  .post(
    "/signup",
    async ({ body, set }) => {
      const existingUser = await db.user.findUnique({
        where: { username: body.username },
      });
      if (existingUser) {
        set.status = 400;
        return { error: "Username already exists" };
      }
      const hashedPassword = await bcrypt.hash(body.password, 10);
      const user = await db.user.create({
        data: {
          username: body.username,
          password: hashedPassword,
        },
      });
      return { id: user.id, username: user.username };
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
      detail: {
        summary: "Sign up a new user",
        tags: ["Auth"],
      },
    }
  )
  .post(
    "/signin",
    async ({ body, jwt, set }) => {
      const user = await db.user.findUnique({
        where: { username: body.username },
      });
      if (!user) {
        set.status = 401;
        return { error: "Invalid credentials" };
      }
      const validPassword = await bcrypt.compare(body.password, user.password);
      if (!validPassword) {
        set.status = 401;
        return { error: "Invalid credentials" };
      }
      const token = await jwt.sign({ userId: user.id });
      return { token };
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
      detail: {
        summary: "Sign in and get a token",
        tags: ["Auth"],
      },
    }
  );
