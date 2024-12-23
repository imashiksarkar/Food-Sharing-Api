import { Router } from 'express'
import authController from '../controllers/auth.controller'
// import requireAuth from '../middlewares/requireAuth'

const authRouter = Router()

authRouter.post('/token', authController.getToken)
authRouter.delete('/logout', authController.logOut)
// authRouter.get('/checkAuth', requireAuth(), authController.checkAuth)

export default authRouter
