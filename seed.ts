import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Load .env file FIRST
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: `${__dirname}/.env` });

// THEN import after env is loaded
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/db/schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL not found in environment variables");
}

const pool = new Pool({ connectionString });
const db = drizzle(pool, { schema });

import { member, allowedEmail } from "@/db/schema";

const seedMembers = [
  {
    name: "Nama Anggota 01",
    email: "anggota1@example.com",
    role: "Ketua Kelompok",
    bio: "Koordinasi umum, arsitektur sistem, dan integrasi fitur antar bagian.",
    image: null,
  },
  {
    name: "Nama Anggota 02",
    email: "anggota2@example.com",
    role: "Frontend Engineer",
    bio: "Merancang dan mengimplementasikan komponen UI, layout responsif, dan pengalaman pengguna yang intuitif.",
    image: null,
  },
  {
    name: "Nama Anggota 03",
    email: "anggota3@example.com",
    role: "Backend Engineer",
    bio: "Mengelola autentikasi, database, dan logika alur data antar halaman aplikasi.",
    image: null,
  },
  {
    name: "Nama Anggota 04",
    email: "anggota4@example.com",
    role: "QA & Dokumentasi",
    bio: "Menguji alur aplikasi, menulis dokumentasi teknis, dan memvalidasi semua requirement yang sudah disepakati.",
    image: null,
  },
];

const seedAllowedEmails = [
  "anggota1@example.com",
  "anggota2@example.com",
  "anggota3@example.com",
  "anggota4@example.com",
];

async function seed() {
  try {
    console.log("🌱 Starting seed...");

    // Seed members
    console.log("📝 Seeding members...");
    for (const m of seedMembers) {
      await db.insert(member).values(m).onConflictDoNothing();
    }

    // Seed allowed emails
    console.log("🔐 Seeding allowed emails...");
    for (const email of seedAllowedEmails) {
      await db.insert(allowedEmail).values({ email }).onConflictDoNothing();
    }

    console.log("✅ Seed completed!");
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    await pool.end();
    process.exit(1);
  }
}

seed();
