import { Router } from 'express'
import foodController from '../controllers/food.controller'
import requireAuth from '../middlewares/requireAuth'

const foodRouter = Router()

foodRouter
  .route('/')
  .get(foodController.findAllFoods)
  .post(requireAuth(), foodController.addFood)

foodRouter.get('/endingSoon', foodController.findEndingSoonestFoods)

foodRouter
  .route('/:foodId')
  .get(foodController.findFoodById)
  .put(requireAuth(), foodController.updateFood)
  .delete(requireAuth(), foodController.deleteFood)

foodRouter.get('/author/:email', foodController.findFoodsByAuthor)
foodRouter.get('/category/:categoryName', foodController.findFoodByCategory)

export default foodRouter
