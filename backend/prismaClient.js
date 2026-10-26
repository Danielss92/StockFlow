//criar instancia do Prisma para reutilizar no Backend


import dotenv from "dotenv";
dotenv.config({path: "../.env"});
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.ts";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({
    adapter
});

export default prisma;