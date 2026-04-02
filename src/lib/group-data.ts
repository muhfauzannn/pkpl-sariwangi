export const siteIdentity = {
  teamName: "Kelompok Sariwangi",
  subtitle: "Website biodata kelompok dengan akses publik dan editor internal.",
  summary:
    "Halaman utama ini menampilkan identitas kelompok, peran anggota, dan gaya presentasi yang bisa dikustomisasi oleh anggota yang login via Google.",
  course: "Project Fullstack",
  semester: "Semester Aktif",
};

export const groupHighlights = [
  {
    title: "Akses publik",
    description:
      "Biodata kelompok, pembagian peran, dan ringkasan project dapat dilihat tanpa login.",
  },
  {
    title: "OAuth Google",
    description:
      "Proses masuk memakai Google agar identitas anggota langsung tervalidasi.",
  },
  {
    title: "Kontrol tampilan",
    description:
      "Anggota kelompok yang terdaftar dapat mengganti warna utama dan font website.",
  },
];

export const groupMembers = [
  {
    name: "Nama Anggota 01",
    role: "Ketua Kelompok",
    focus: "Koordinasi, arsitektur, dan integrasi fitur.",
    initials: "A1",
  },
  {
    name: "Nama Anggota 02",
    role: "Frontend Engineer",
    focus: "Komponen antarmuka, layout, dan pengalaman pengguna.",
    initials: "A2",
  },
  {
    name: "Nama Anggota 03",
    role: "Backend Engineer",
    focus: "Auth, database, dan alur data antar halaman.",
    initials: "A3",
  },
  {
    name: "Nama Anggota 04",
    role: "QA & Dokumentasi",
    focus: "Uji alur, dokumentasi setup, dan validasi requirement.",
    initials: "A4",
  },
] as const;

export const stackItems = [
  "Next.js App Router",
  "Better Auth",
  "Google OAuth",
  "PostgreSQL + Drizzle ORM",
  "shadcn/ui",
];
