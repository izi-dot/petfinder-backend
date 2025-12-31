import dotenv from 'dotenv';
dotenv.config();

interface Config {
  dbUrl: string;
  dbUser: string;
  dbPassword: string;
  dbName: string
  port: number;
}

export const config: Config = {
    dbUrl: process.env.DATABASE_URL || 'localhost',
    dbUser: process.env.DATABASE_USER || 'root',
    dbPassword: process.env.DATABASE_PASSWORD || 'password',
    dbName: process.env.DATABASE_NAME || 'db',
    port: parseInt(process.env.PORT || '3000', 10),
};