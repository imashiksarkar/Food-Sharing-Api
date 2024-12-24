import { Response } from 'express'
import { ReqWithUser } from '../middlewares/requireAuth'
import foodRequestService from '../services/foodRequest.service'
import { IFoodRequestService } from '../types/foodRequest.types'
import catchAsync from '../utils/catchAsync'

class FoodRequestController {
  constructor(private foodRequestService: IFoodRequestService) {}

  addFoodRequest = catchAsync(async (req: ReqWithUser, res: Response) => {
    const email = req.locals.user.email
    const foodId = req.params.foodId

    const addedFoodRequest = await this.foodRequestService.addFoodRequest(
      email,
      foodId
    )

    res.status(201).json(addedFoodRequest)
  })
}

const foodRequestController = new FoodRequestController(foodRequestService)

export default foodRequestController
