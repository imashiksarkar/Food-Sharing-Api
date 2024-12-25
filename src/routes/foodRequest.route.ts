import { Router } from 'express'
import foodRequestController from '../controllers/foodRequest.controller'
import requireAuth from '../middlewares/requireAuth'

const foodRequestRouter = Router()

foodRequestRouter
  .route('/:foodId')
  .put(requireAuth(), foodRequestController.addFoodRequest)
  .patch(requireAuth(), foodRequestController.updateFoodRequestStatus)

export default foodRequestRouter
