import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "@/db/schema";

declare global {
  var __pkplSariwangiPool: Pool | undefined;
}

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@127.0.0.1:5432/postgres";

const globalPool = globalThis.__pkplSariwangiPool;

export const pool =
  globalPool ??
  new Pool({
    connectionString,
    max: process.env.NODE_ENV === "production" ? 10 : 1,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__pkplSariwangiPool = pool;
}

export const db = drizzle(pool, { schema });

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}
