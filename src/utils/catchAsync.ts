import { NextFunction, Request, Response } from 'express'
import { ReqWithUser } from '../middlewares/requireAuth'

type CB = (req: ReqWithUser, res: Response, next: NextFunction) => void

const catchAsync =
  (cb: CB) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await cb(req as ReqWithUser, res, next)
    } catch (error) {
      next(error)
    }
  }

export default catchAsync
