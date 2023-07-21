import { Redis } from "ioredis";
import dayjs from 'dayjs';

export const queue = new Redis({
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined,
  host: process.env.REDIS_HOST,
});

export const sub = new Redis({
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined,
  host: process.env.REDIS_HOST,
});

export const cache = new Redis({
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined,
  host: process.env.REDIS_HOST,
})

export async function get(key: string) {
  try {
    const result = await cache.get(key);
    return result;
  } catch (err) {
    return null;
  }
}

export async function set(key: string, value: string) {
  try {
    const now = dayjs();
    const targetTime = dayjs().set('hour', 23).set('minute', 30).set('second', 0);
    const diff = targetTime.diff(now, 'second');    
    
    const result = await cache.set(key, value, 'EX', diff);
    return result;
  } catch (err) {
    return null;
  }
}
