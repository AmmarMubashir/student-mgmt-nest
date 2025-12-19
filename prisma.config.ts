import * as dotenv from 'dotenv';

dotenv.config();

export const prismaConfig = {
  databaseUrl: process.env.DATABASE_URL || '',
};

if (!prismaConfig.databaseUrl) {
  // eslint-disable-next-line no-console
  console.warn('DATABASE_URL is not set. Prisma will fail to connect.');
}

