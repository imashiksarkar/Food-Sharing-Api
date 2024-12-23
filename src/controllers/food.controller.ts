import { Response } from 'express'
import { Err } from 'http-staror'
import addFoodDto, { verifyEmail } from '../dtos/food.dto'
import { ReqWithUser } from '../middlewares/requireAuth'
import foodService from '../services/food.service'
import { IFoodService } from '../types/food.types'
import catchAsync from '../utils/catchAsync'

class FoodController {
  constructor(private foodService: IFoodService) {}

  addFood = catchAsync(async (req: ReqWithUser, res: Response) => {
    const {
      success,
      data: body,
      error: validationError,
    } = addFoodDto.safeParse(req.body)

    

    if (!success)
      throw Err.setStatus('BadRequest').setMessage(validationError?.message)

    const {
      success: emailSuccess,
      data: authorEmail,
      error: emailError,
    } = verifyEmail.safeParse(req.locals.user.email)

    if (!emailSuccess)
      throw Err.setStatus('BadRequest').setMessage(emailError?.message)

    const { data, error } = await this.foodService.addFood(authorEmail, body)

    if (error) throw Err.setStatus('BadRequest').setMessage(error)

    res.status(200).json(data)
  })
}

const foodController = new FoodController(foodService)

export default foodController
