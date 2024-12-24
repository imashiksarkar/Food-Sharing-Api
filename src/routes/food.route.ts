import { Router } from 'express'
import foodController from '../controllers/food.controller'
import requireAuth from '../middlewares/requireAuth'

const foodRouter = Router()

foodRouter
  .route('/')
  .get(foodController.findAllFoods)
  .post(requireAuth(), foodController.addFood)

foodRouter
  .route('/:foodId')
  .get(foodController.findFoodById)
  .put(requireAuth(), foodController.updateFood)

export default foodRouter
