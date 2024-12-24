import { MongooseError, isValidObjectId } from 'mongoose'
import Food from '../models/Food.model'
import {
  AddFoodDto,
  AuthorDetails,
  FoodRes,
  IFoodDocument,
  IFoodService,
} from '../types/food.types'

class FoodService implements IFoodService {
  addFood = async (authorDetails: AuthorDetails, foodInput: AddFoodDto) => {
    const res: FoodRes<IFoodDocument> = {
      data: null,
      error: null,
    }

    try {
      const newFood = new Food({
        ...foodInput,
        ...authorDetails,
      })

      const savedFood = await newFood.save()

      res.data = savedFood

      return res
    } catch (error: MongooseError | unknown) {
      if (error instanceof MongooseError) res.error = error.message
      else if (typeof error === 'string') res.error = error
      else res.error = 'Unknown error - add food service'

      return res
    }
  }

  findAllFoods = async () => {
    const res: FoodRes<IFoodDocument[]> = {
      data: null,
      error: null,
    }
    try {
      const foods = await Food.find()

      res.data = foods

      return res
    } catch (error) {
      if (error instanceof MongooseError) res.error = error.message
      else if (typeof error === 'string') res.error = error
      else res.error = 'Unknown error - add food service'

      return res
    }
  }

  findFoodById = async (id: string) => {
    const res: FoodRes<IFoodDocument> = {
      data: null,
      error: null,
    }

    if (!isValidObjectId(id)) {
      res.error = 'Invalid id'
      return res
    }

    try {
      const food = await Food.findById(id)

      res.data = food

      return res
    } catch (error) {
      if (error instanceof MongooseError) res.error = error.message
      else if (typeof error === 'string') res.error = error
      else res.error = 'Unknown error - add food service'

      return res
    }
  }

  updateFoodById = async (id: string, foodInput: AddFoodDto) => {
    const res: FoodRes<IFoodDocument> = {
      data: null,
      error: null,
    }

    if (!isValidObjectId(id)) {
      res.error = 'Invalid id'
      return res
    }

    try {
      const food = await Food.findByIdAndUpdate(id, foodInput, { new: true })
      if (!food) res.error = 'Food not found'

      res.data = food
    } catch (error) {
      if (error instanceof MongooseError) res.error = error.message
      else if (typeof error === 'string') res.error = error
      else res.error = 'Unknown error - add food service'
    }

    return res
  }
}

const foodService = new FoodService()

export default foodService
