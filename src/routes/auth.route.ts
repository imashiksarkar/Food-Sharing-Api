import { Router } from 'express'
import authController from '../controllers/auth.controller'

const authRouter = Router()

authRouter.post('/token', authController.getToken)
authRouter.delete('/logout', authController.logOut)

export default authRouter
