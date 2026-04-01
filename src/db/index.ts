// this file will connect Drizzle ORM to the database then export the connection to be used in other files
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(process.env.DATABASE_URL!);
