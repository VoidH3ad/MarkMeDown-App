import { neon } from "@neondatabase/serverless"; // Cliente HTTP para Neon
import { drizzle } from "drizzle-orm/neon-http"; // ORM Drizzle adaptado ao Neon

import * as schema from "./schema"; // Suas tabelas definidas

const sql = neon(process.env.DATABASE_URL!); // Cria a conexão

export const db = drizzle(sql, { schema }); // Exporta o ORM
