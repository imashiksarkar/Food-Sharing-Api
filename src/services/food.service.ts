import { MongooseError, isValidObjectId } from 'mongoose'
import Food from '../models/Food.model'
import {
  AddFoodDto,
  AuthorDetails,
  FoodRes,
  IFoodDocument,
  IFoodService,
} from '../types/food.types'
import { Err } from 'http-staror'

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

  deleteFood = async (id: string, authorEmail: string) => {
    const res: FoodRes<IFoodDocument> = {
      data: null,
      error: null,
    }

    if (!isValidObjectId(id)) {
      res.error = 'Invalid id'
      return res
    }

    try {
      const food = await Food.findOneAndDelete(
        { _id: id, authorEmail },
        { new: true }
      )
      if (!food) {
        res.error = 'Food not found'
        throw Err.setStatus('NotFound').setMessage('Food not found')
      }

      res.data = food
    } catch (error) {
      if (error instanceof Err) throw error
      else if (error instanceof MongooseError) res.error = error.message
      else if (typeof error === 'string') res.error = error
      else res.error = 'Unknown error - add food service'
    }

    return res
  }

  findFoodsByAuthorEmail = async (authorEmail: string) => {
    const res: FoodRes<IFoodDocument[]> = {
      data: null,
      error: null,
    }

    try {
      const foods = await Food.find({ authorEmail })

      res.data = foods
    } catch (error) {
      if (error instanceof MongooseError) res.error = error.message
      else if (typeof error === 'string') res.error = error
      else res.error = 'Unknown error - add food service'
    }

    return res
  }

  findFoodsByCategory = async (category: string) => {
    const res: FoodRes<IFoodDocument[]> = {
      data: null,
      error: null,
    }

    try {
      const foods = await Food.find({ category })

      res.data = foods
    } catch (error) {
      if (error instanceof MongooseError) res.error = error.message
      else if (typeof error === 'string') res.error = error
      else res.error = 'Unknown error - add food service'
    }

    return res
  }

  findEndingSoonestFoods = async () => {
    const res: FoodRes<IFoodDocument[]> = {
      data: null,
      error: null,
    }

    try {
      const foods = await Food.find({}).sort({ expirationDate: 1 }).limit(10)

      res.data = foods
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
