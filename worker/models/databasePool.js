import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

const isDevType = process.env.MODE === 'dev';

const pool = mysql.createPool({
  host: isDevType? process.env.MYSQL_HOST:process.env.RDS_HOST,
  user: isDevType?process.env.MYSQL_USER:process.env.RDS_USER,
  password: isDevType?process.env.MYSQL_PASSWORD:process.env.RDS_PASSWORD,
  database: isDevType?process.env.MYSQL_DATABASE:process.env.RDS_DATABASE,
});


export default pool;
