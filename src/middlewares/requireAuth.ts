import { NextFunction, Request, Response } from 'express'
import { DecodedIdToken } from 'firebase-admin/auth'
import { Err } from 'http-staror'
import FirebaseService from '../services/firebase.service'
import catchAsync from '../utils/catchAsync'

export interface ReqWithUser<T extends 'passThrough' | unknown = unknown>
  extends Request {
  locals: {
    user: T extends 'passThrough' ? DecodedIdToken | null : DecodedIdToken
  }
}

const requireAuth = (passThrough = false) =>
  catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const token = req.headers?.authorization?.split(' ')[1]
    if (!token)
      throw Err.setStatus('Unauthorized').setMessage('Login Required.')

    const request = req as ReqWithUser<'passThrough'>
    try {
      const user = await FirebaseService.verifyUserToken(token)
      request.locals.user = user

      return next()

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error: unknown) {
      request.locals.user = null

      if (passThrough) return next()

      throw Err.setStatus('Unauthorized').setMessage('Unauthorized')
    }
  })

export default requireAuth
