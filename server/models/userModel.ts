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

export async function findUserById(id: string) {
  const results = await pool.query(
    `
    SELECT * FROM users
    WHERE id = ?
  `,
    [id]
  );
  const users = z.array(UserSchema).parse(results[0]);
  return users[0];
}
