import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system/legacy";

let db: SQLite.SQLiteDatabase | undefined;
export async function openDB():Promise<SQLite.SQLiteDatabase> {
  try {
    if (!db) {
      db = SQLite.openDatabaseSync("app.db");
      await db.execAsync(`PRAGMA foreign_keys = ON;`);
    }
    return db;
  } catch (error) {
    console.error("Error opening database:", error);
    throw error;
  }
}

export async function resetDatabase() {
  try {
    await SQLite.deleteDatabaseAsync('app.db');
    console.log('Database reset successfully.');
  } catch (error) {
    console.error("Error resetting database:", error);
  }
}

export async function initDB():Promise<void> {
  try {
    await openDB();
    if(db)
      db.execSync(`CREATE TABLE IF NOT EXISTS categorias (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Nome TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS produtos (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Nome TEXT NOT NULL,
        Valor REAL,
        DataCad TEXT DEFAULT CURRENT_TIMESTAMP,
        CategoriaId INTEGER,
        FOREIGN KEY (CategoriaId) REFERENCES categorias(Id) ON DELETE SET NULL
      );`);
  } catch (error) {
    console.error("Error initializing database:", error);    
  }
}
