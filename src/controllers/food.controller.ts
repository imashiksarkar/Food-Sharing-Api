import { Response } from 'express'
import { Err } from 'http-staror'
import addFoodDto from '../dtos/food.dto'
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

    const { email: authorEmail, name: donatorName } = req.locals.user

    const { data, error } = await this.foodService.addFood(
      {
        authorEmail,
        donatorName,
      },
      body
    )

    if (error) throw Err.setStatus('BadRequest').setMessage(error)

    res.status(201).json(data)
  })

  findAllFoods = catchAsync(async (_req: ReqWithUser, res: Response) => {
    const { data, error } = await this.foodService.findAllFoods()

    if (error) throw Err.setStatus('InternalServerError').setMessage(error)

    res.status(200).json(data)
  })

  findFoodById = catchAsync(async (req: ReqWithUser, res: Response) => {
    const { data, error } = await this.foodService.findFoodById(
      req.params.foodId
    )

    if (error) throw Err.setStatus('BadRequest').setMessage(error)

    res.status(200).json(data)
  })

  updateFood = catchAsync(async (req: ReqWithUser, res: Response) => {
    const { data, error } = await this.foodService.updateFoodById(
      req.params.foodId,
      req.body
    )

    if (error) throw Err.setStatus('BadRequest').setMessage(error)

    res.status(200).json(data)
  })

  deleteFood = catchAsync(async (req: ReqWithUser, res: Response) => {
    const { data, error } = await this.foodService.deleteFood(
      req.params.foodId,
      req.locals.user.email
    )

    if (error) throw Err.setStatus('BadRequest').setMessage(error)

    res.status(200).json(data)
  })
}

const foodController = new FoodController(foodService)

export default foodController
