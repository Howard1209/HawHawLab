import { ResultSetHeader } from "mysql2";
import { z } from "zod";
import * as argon2 from "argon2";
import pool from "./databasePool.js";

function instanceOfSetHeader(object: any): object is ResultSetHeader {
  return "insertId" in object;
}

export async function createUser(
  email: string,
  name: string,
  password: string
) {
  const token = await argon2.hash(password);
  const results = await pool.query(
    `
    INSERT INTO users (email, name, password)
    VALUES(?, ?, ?)
  `,
    [email, name, token]
  );
  if (Array.isArray(results) && instanceOfSetHeader(results[0])) {
    return results[0].insertId;
  }
  throw new Error("create user failed");
}

const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  password: z.string(),
});

export async function findUser(email: string) {
  const results = await pool.query(
    `
    SELECT * FROM users
    WHERE email = ?
  `,
    [email]
  );
  const users = z.array(UserSchema).parse(results[0]);
  return users[0];
}

const UserProfileSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
});

export async function findUserById(id: string) {
  const results = await pool.query(
  `
    SELECT id, name, email FROM users
    WHERE id = ?
  `,
    [id]
  );
  const users = z.array(UserProfileSchema).parse(results[0]);
  return users[0];
}

export async function createStrategy(
  id:string, title:string, code:string, successRate:number,
  totalProfit:number, maximumLoss:number, maximumProfit:number
  ) {
  const results = await pool.query(
    `
    INSERT INTO strategy (title, code, user_id, success_rate, total_profit, maximum_loss, maximum_profit)
    VALUES(?, ?, ?, ?, ?, ?, ?)
  `,
    [title, code, id, successRate, totalProfit, maximumLoss, maximumProfit]
  );  
  if (Array.isArray(results) && instanceOfSetHeader(results[0])) {
    return results[0].insertId;
  }
  throw new Error("create strategy failed");
}

const StrategySchema = z.object({
  id: z.number(),
  title: z.string(),
  code: z.string(),
  user_id: z.number(),
  success_rate: z.number(),
  total_profit: z.number(),
  maximum_loss: z.number(),
  maximum_profit: z.number(),
  update_time:z.date(),
});

export async function getStrategy(userId:number) {
  const results = await pool.query(
    `
    SELECT * FROM strategy
    WHERE user_id = ?
    `,
    [userId]
  );  
  const strategy = z.array(StrategySchema).parse(results[0])    
  return strategy;
}