import { Redis } from "ioredis";

export const queue = new Redis({
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined,
  host: process.env.REDIS_HOST,
});

export const sub = new Redis({
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined,
  host: process.env.REDIS_HOST,
});
