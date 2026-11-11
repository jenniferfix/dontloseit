import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { relations } from "./relations";

const client = new Pool({
	connectionString: process.env.DATABASE_URL as string,
});

export const db = drizzle({ client, relations });

export type Database = typeof db;

export type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];

export type DatabaseExecutor = Database | Transaction;
