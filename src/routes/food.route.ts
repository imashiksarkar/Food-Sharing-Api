import { Router } from 'express'
import foodController from '../controllers/food.controller'
import requireAuth from '../middlewares/requireAuth'

const foodRouter = Router()

foodRouter.post('/', requireAuth(), foodController.addFood)

export default foodRouter
