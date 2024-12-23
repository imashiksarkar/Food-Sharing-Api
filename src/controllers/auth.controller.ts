import { Request, Response } from 'express'
import authDto from '../dtos/auth.dto'
import catchAsync from '../utils/catchAsync'
import { Err } from 'http-staror'
import env from '../config/env.config'
import { IAuthService } from '../types/auth.types'
import authService from '../services/auth.service'
import { JsonWebTokenError } from 'jsonwebtoken'
// import { ReqWithUser } from '../middlewares/requireAuth'
// import { ReqWithUser } from '../middlewares/requireAuth'

class AuthController {
  constructor(private authService: IAuthService) {}

  getToken = catchAsync(async (req: Request, res: Response) => {
    const { success, data, error } = authDto.safeParse(req.body)
    if (!success) throw Err.setStatus('BadRequest').setMessage(error?.message)

    const { token, error: tokenError } = this.authService.generateToken(data)

    if (tokenError && tokenError instanceof JsonWebTokenError)
      throw Err.setStatus('InternalServerError').setMessage(tokenError.message)
    else if (tokenError)
      throw Err.setStatus('InternalServerError').setMessage(tokenError)

    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: env.IS_PRODUCTION ? 'none' : 'lax',
      secure: env.IS_PRODUCTION,
      maxAge: 1000 * 60 * 60, //1h
    })

    res.end()
  })

  logOut = catchAsync(async (_req: Request, res: Response) => {
    res.clearCookie('access_token')
    res.status(200).end()
  })

  // checkAuth = catchAsync(async (req: ReqWithUser, res: Response) => {
  //   res.status(200).json(req.locals.user)
  // })
}

const authController = new AuthController(authService)

export default authController
