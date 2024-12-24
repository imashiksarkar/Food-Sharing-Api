import { Router } from 'express'
import HealthController from '../controllers/health.controller'
import notFoundController from '../controllers/notFound.controller'
import rootController from '../controllers/root.controller'
import authRouter from './auth.route'
import foodRouter from './food.route'
import foodRequestRouter from './foodRequest.route'

const router = Router()

router.get('/', rootController.root)

router.get('/health', HealthController.healthCheck)

router.use('/auth', authRouter)

router.use('/foods', foodRouter)
router.use('/foods/request', foodRequestRouter)

router.all('/*', notFoundController.notFound)

export default router
