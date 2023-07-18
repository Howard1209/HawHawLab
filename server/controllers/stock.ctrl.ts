import { Request, Response } from 'express';
import * as stock from '../models/stockModel.js';
import * as cache from '../models/redis.js';

export async function getStockList(req: Request, res: Response) {
try {
    const data = await stock.getStockList()    
    res.status(200).json({data});
} catch (err) {
  if (err instanceof Error) {
    res.status(400).json({error: err.message});
    return;
  }
  res.status(500).json({ error: "Get stock failed" });
}}

export async function getStockDetail(req: Request, res: Response) {
try {
    const {stockId} = req.body;
    const cachedStockInfo = await cache.get(stockId);
    if (cachedStockInfo) {
      const stockInfo = JSON.parse(cachedStockInfo);
      res.status(200).json({data:stockInfo});
      return
    }
    const stockInfo = await stock.getStockDetail(stockId);
    await cache.set(stockId, JSON.stringify(stockInfo));
    res.status(200).json({data:stockInfo});
} catch (err) {
  if (err instanceof Error) {
    res.status(400).json({error: err.message});
    return;
  }
  res.status(500).json({ error: "Get stock failed" });
}}

