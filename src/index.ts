import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { authRoutes } from "./auth";
import { postRoutes } from "./posts";

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "Elysia API",
          version: "1.0.0",
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
      },
      path: "/swagger",
    })
  )
  .use(authRoutes)
  .use(postRoutes)
  .get("/", () => "Hello Elysia")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
console.log(`📚 Swagger docs at http://localhost:3000/swagger`);
