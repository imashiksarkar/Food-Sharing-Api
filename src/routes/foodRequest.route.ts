import { Router } from 'express'
import foodRequestController from '../controllers/foodRequest.controller'
import requireAuth from '../middlewares/requireAuth'

const foodRequestRouter = Router()

foodRequestRouter.put(
  '/:foodId',
  requireAuth(),
  foodRequestController.addFoodRequest
)

export default foodRequestRouter
