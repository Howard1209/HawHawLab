import { Request, Response, NextFunction } from "express";

async function formValidator(req: Request, res: Response, next: NextFunction) {
  try {
    const { stockId, type, openCondition, closeCondition } = req.body;

    if (stockId.length !== 4) {
      throw new Error('The number of stockId should be 4')
    }
    if (type !== 'long' && type !== 'short') {
      res.status(403).json({error:"Type should be long or short"});
      return;
    }
    if (openCondition.value.length ==0 ) {
      res.status(403).json({error:"Please complete thr form in open combination"});
      return;
    }
    if (closeCondition.value.length ==0 ) {
      res.status(403).json({error:"Please complete thr form in close combination"});
      return;
    }

    
    next();
  } catch (err) {
    if (err instanceof Error) {
      res.status(401).json({ error: err.message });
      return;
    }
    res.status(401).json({ error: "authenticate failed" });
  }  
}

export default formValidator;
