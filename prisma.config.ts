import "dotenv/config";
import { defineConfig } from "prisma/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// Local dev talks to the SQLite file; hosted (Vercel) talks to Turso when
// TURSO_DATABASE_URL is present. Applies to `prisma migrate` and friends.
const tursoUrl = process.env.TURSO_DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: tursoUrl
      ? `${tursoUrl}?authToken=${process.env.TURSO_AUTH_TOKEN}`
      : (process.env.DATABASE_URL ?? "file:./dev.db"),
  },
  ...(tursoUrl
    ? {
        adapter: async () =>
          new PrismaLibSql({
            url: tursoUrl,
            authToken: process.env.TURSO_AUTH_TOKEN,
          }),
      }
    : {}),
});
