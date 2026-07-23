import "dotenv/config";
import { defineConfig } from "prisma/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// Local dev talks to the SQLite file; hosted (Vercel) talks to Turso when
// TURSO_DATABASE_URL is present. Applies to `prisma migrate` and friends.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  ...(process.env.TURSO_DATABASE_URL
    ? {
        adapter: async () =>
          new PrismaLibSql({
            url: process.env.TURSO_DATABASE_URL!,
            authToken: process.env.TURSO_AUTH_TOKEN,
          }),
      }
    : {
        datasource: {
          url: process.env.DATABASE_URL ?? "file:./dev.db",
        },
      }),
});
