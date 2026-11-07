import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./index";

async function runMigrations() {
  try {
    console.log("🔄 Memulai proses migrasi Drizzle...");
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("🎉 Migrasi Drizzle berhasil dijalankan!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migrasi gagal:", error);
    process.exit(1);
  }
}

runMigrations();
