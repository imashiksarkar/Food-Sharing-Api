import { NextFunction, Request, Response } from 'express'

type CB = (req: Request, res: Response, next: NextFunction) => void

const catchAsync =
  (cb: CB) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await cb(req, res, next)
    } catch (error) {
      next(error)
    }
  }

export default catchAsync
