import { Redis } from "ioredis";
import * as dotenv from "dotenv";
import { getReport } from "./models/script.js";

dotenv.config();

const queue = new Redis({
  port: 6379, // Redis port
  host: process.env.REDIS_HOST,
});

const pub = new Redis({
  port: process.env.REDIS_PORT, // Redis port
  host: process.env.REDIS_HOST,
});

const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const worker = async () => {
  console.log("queue started");
  while (true) {
    try {
      const results = await queue.brpop("queues", 5);
      if (Array.isArray(results)) {
        const report = await getReport(results[1])
        pub.publish("script", JSON.stringify({report}));
      }
    } catch (err) {
      pub.publish("script", JSON.stringify({error: err.message}));
    }
    sleep(1000);
  }
};

worker();



