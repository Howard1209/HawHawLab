import express, { Express, Request, Response, Router } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from "path";
import backtestingRouter from './routes/backtesting.js';
import userRouter from "./routes/user.js";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/api",[
  backtestingRouter,
  userRouter,
]);

app.use(express.static("../../client/dist"));

const __dirname = path.resolve('../../client/dist/index.html');
app.get("*", (req , res) => {
  res.sendFile(__dirname)
});


// app.get('/', (req: Request, res: Response) => {
//   res.send('Express + TypeScript Server');
// });

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});