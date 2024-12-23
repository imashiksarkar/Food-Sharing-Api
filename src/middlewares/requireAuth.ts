import { NextFunction, Request, Response } from 'express'
import { Err } from 'http-staror'
import { JsonWebTokenError, JwtPayload } from 'jsonwebtoken'
import authService from '../services/auth.service'
import catchAsync from '../utils/catchAsync'

export interface IUser extends JwtPayload {
  name: string
  email: string
  photoUrl?: string
  iat: number
  exp: number
}

export interface ReqWithUser<T extends 'passThrough' | unknown = unknown>
  extends Request {
  locals: {
    user: T extends 'passThrough' ? IUser | null : IUser
  }
}

const requireAuth = (passThrough = false) =>
  catchAsync(
    async (
      req: ReqWithUser<'passThrough'>,
      _res: Response,
      next: NextFunction
    ) => {
      const token = (req.cookies.access_token || '') as string

      const { data, error } = authService.verifyToken(token)
      req.locals = {
        user: data as IUser,
      }

      if (error && passThrough) return next()
      else if (error && error instanceof JsonWebTokenError)
        throw Err.setStatus('Unauthorized').setMessage(error.message)
      else if (error) throw Err.setStatus('Unauthorized').setMessage(error)

      return next()
    }
  )

export default requireAuth
