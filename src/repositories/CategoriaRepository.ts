import { openDB } from "../database/database";
import * as SQLite from "expo-sqlite";
import { Categoria } from "../models/CategoriaModel";

export class CategoriaRepository {
  async create(categoria: Categoria): Promise<void> {
    try {
      const db = await openDB();
      await db.runAsync(`INSERT INTO categorias (Nome) VALUES (?);`, [
        categoria.Nome,
      ]);
    } catch (error) {
      console.error("Error creating categoria:", error);
      throw error;
    }
  }

  async findAll(): Promise<Categoria[]> {
    try {
      const db = await openDB();
      const result = await db.getAllAsync<Categoria>(
        `SELECT * FROM categorias;`,
      );
      return result;
    } catch (error) {
      console.error("Error fetching categorias:", error);
      throw error;
    }
  }

  async delete(id: number): Promise<SQLite.SQLiteRunResult> {
    try {
      const db = await openDB();
      return await db.runAsync(`DELETE FROM categorias WHERE Id = ?;`, [id]);
    } catch (error) {
      console.error("Error deleting categoria:", error);
      throw error;
    }
  }

  async update(categoria: Categoria): Promise<SQLite.SQLiteRunResult> {
    try {
      const db = await openDB();
      return await db.runAsync(`UPDATE categorias SET Nome = ? WHERE Id = ?;`, [categoria.Nome, categoria.Id]);
    } catch (error) {
      console.error("Error updating categoria:", error);
      throw error;
    }
  }
}
