import { Response } from 'express'
import { Err } from 'http-staror'
import updateFoodRequestDto from '../dtos/foodRequest.dto'
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

  updateFoodRequestStatus = catchAsync(
    async (req: ReqWithUser, res: Response) => {
      const foodRequestId = req.params.foodId

      const { success, data, error } = updateFoodRequestDto.safeParse(req.body)

      if (!success) throw Err.setStatus('BadRequest').setMessage(error?.message)

      const user = req.locals.user.email

      const updatedFoodRequest =
        await this.foodRequestService.updateFoodRequestStatus({
          user,
          foodRequestId,
          status: data.status,
        })

      res.status(200).json(updatedFoodRequest)
    }
  )

  fetchFoodRequestsByRequestor = catchAsync(
    async (req: ReqWithUser, res: Response) => {
      const user = req.locals.user.email

      const foodRequests =
        await this.foodRequestService.fetchFoodRequestsByRequestor(user)

      res.status(200).json(foodRequests)
    }
  )

  findFoodRequestsByFoodId = catchAsync(
    async (req: ReqWithUser, res: Response) => {
      const foodId = req.params.foodId
      const authorEmail = req.locals.user.email

      const foodRequests =
        await this.foodRequestService.findFoodRequestsByFoodId(
          foodId,
          authorEmail
        )

      res.status(200).json(foodRequests)
    }
  )
}

const foodRequestController = new FoodRequestController(foodRequestService)

export default foodRequestController
