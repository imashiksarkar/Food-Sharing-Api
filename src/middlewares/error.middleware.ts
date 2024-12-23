import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { Err } from 'http-staror'

const errorMiddleware =
  () =>
  (
    err: ErrorRequestHandler,
    _req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction
  ) => {
    if (err instanceof Err) {
      res.status(err.statusCode).json(err)
      return
    }

    res.status(500).json(err)
  }

export default errorMiddleware
