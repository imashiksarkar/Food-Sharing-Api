import { Router } from 'express'
import HealthController from '../controllers/health.controller'
import notFoundController from '../controllers/notFound.controller'
import rootController from '../controllers/root.controller'
import authRouter from './auth.route'

const router = Router()

router.get('/', rootController.root)

router.get('/health', HealthController.healthCheck)

router.use('/auth', authRouter)

router.all('/*', notFoundController.notFound)

export default router
