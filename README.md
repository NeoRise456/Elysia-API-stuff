# Elysia API

A simple REST API built with Elysia.js, Prisma, and PostgreSQL. Features user authentication with JWT and post management.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Elysia.js](https://elysiajs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL
- **Auth**: JWT
- **Docs**: OpenAPI/Swagger

## Prerequisites

- [Bun](https://bun.sh/) installed
- PostgreSQL database running

## Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd elysia-test-2
```

2. Install dependencies:
```bash
bun install
```

3. Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<database>"
JWT_SECRET="your-secret-key-here"
```

4. Set up the database:
```bash
bunx prisma generate
bunx prisma db push
```

## Running the Project

### Development
```bash
bun run dev
```

The server will start at `http://localhost:3000` with hot-reload enabled.

### Production
```bash
bun run src/index.ts
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/signup` | Register a new user | No |
| POST | `/auth/signin` | Login and get JWT token | No |
| POST | `/posts` | Create a new post | Yes |
| GET | `/posts` | Get all posts for authenticated user | Yes |
| GET | `/swagger` | OpenAPI documentation | No |

## API Documentation

Access the interactive Swagger UI at: `http://localhost:3000/swagger`

## Usage Examples

### Sign Up
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"myuser\", \"password\": \"mypassword\"}"
```

Response:
```json
{
  "id": 1,
  "username": "myuser"
}
```

### Sign In
```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"myuser\", \"password\": \"mypassword\"}"
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Create a Post
Replace `YOUR_TOKEN` with the token from sign in:

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"title\": \"My First Post\", \"description\": \"Hello world!\"}"
```

Response:
```json
{
  "id": 1,
  "title": "My First Post",
  "description": "Hello world!"
}
```

### Get Your Posts
```bash
curl -X GET http://localhost:3000/posts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response:
```json
[
  {
    "id": 1,
    "title": "My First Post",
    "description": "Hello world!",
    "userId": 1,
    "createdAt": "2026-02-16T10:00:00.000Z"
  }
]
```

## Project Structure

```
src/
├── index.ts           # Main app entry point
├── db.ts              # Prisma client instance
├── auth/
│   └── index.ts       # Authentication routes
├── posts/
│   └── index.ts       # Post routes
└── middleware/
    └── auth.ts        # JWT verification middleware
prisma/
├── schema.prisma      # Database schema
└── config.ts          # Prisma configuration
```

## License

MIT
