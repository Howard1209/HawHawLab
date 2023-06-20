import express, { Express, Request, Response, Router } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import backtestingRouter from './routes/backtesting.js';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const router = Router();

app.use(cors());
app.use(express.json());
app.use("/api",[
  backtestingRouter
]);


app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});