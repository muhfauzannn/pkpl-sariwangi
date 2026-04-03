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
    name: "Muhammad Fauzan",
    email: "fauzannmuhh@gmail.com",
    role: "Fullstack Engineer",
    bio: "Hai",
    image: null,
  },
  {
    name: "Annisa Fakhira Cendekia",
    email: "annisalfahira@gmail.com",
    role: "Frontend Engineer",
    bio: "aku annisa fakhira cendekia, biasanya dipanggil nisaa dari jurusan sistem informasi dan mbti akuu istj",
    image: null,
  },
  {
    name: "Kalista Wiarta",
    email: "anggota3@example.com",
    role: "Backend Engineer",
    bio: "halo aku kalista, biasa dipanggil kall. aku suka banget denger lagu kalau lagi stress, terutama lagu Tulus",
    image: null,
  },
  {
    name: "Saikhah Ummu Anja Amalia",
    email: "anggota4@example.com",
    role: "QA & Dokumentasi",
    bio: "nama di ktp saikhah ummu anja amalia, kalo di tkp saikhah. domisili jakarta selatan. hobby horse riding walaupun looknya kaya just kidding. funfact suka jatoh ke sandung kaki sendiri.",
    image: null,
  },
  {
    name: "Airin",
    email: "anggota5@example.com",
    role: "QA & Dokumentasi",
    bio: "nama di ktp saikhah ummu anja amalia, kalo di tkp saikhah. domisili jakarta selatan. hobby horse riding walaupun looknya kaya just kidding. funfact suka jatoh ke sandung kaki sendiri.",
    image: null,
  },
];

const seedAllowedEmails = [
  "fauzannmuhh@gmail.com",
  "annisalfahira@gmail.com",
  "anggota3@example.com",
  "anggota4@example.com",
  "anggota5@example.com",
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
