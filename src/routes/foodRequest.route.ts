import { Router } from 'express'
import foodRequestController from '../controllers/foodRequest.controller'
import requireAuth from '../middlewares/requireAuth'

const foodRequestRouter = Router()

foodRequestRouter.get(
  '/',
  requireAuth(),
  foodRequestController.fetchFoodRequestsByRequestor
)

foodRequestRouter
  .route('/:foodId')
  .get(requireAuth(), foodRequestController.findFoodRequestsByFoodId) // for author
  .put(requireAuth(), foodRequestController.addFoodRequest)
  .patch(requireAuth(), foodRequestController.updateFoodRequestStatus)

export default foodRequestRouter
