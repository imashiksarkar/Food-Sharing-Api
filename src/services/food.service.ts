import { MongooseError } from 'mongoose'
import Food from '../models/Food.model'
import {
  AddFoodDto,
  FoodRes,
  IFoodDocument,
  IFoodService,
} from '../types/food.types'

class FoodService implements IFoodService {
  addFood = async (authorEmail: string, foodInput: AddFoodDto) => {
    const res: FoodRes<IFoodDocument> = {
      data: null,
      error: null,
    }

    try {
      const newFood = new Food({
        ...foodInput,
        authorEmail,
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
}

const foodService = new FoodService()

export default foodService
