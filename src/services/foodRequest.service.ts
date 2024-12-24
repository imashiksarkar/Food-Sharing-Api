import { Err } from 'http-staror'
import { MongooseError } from 'mongoose'
import FoodRequest from '../models/FoodRequest.model'
import { IFoodRequestService } from '../types/foodRequest.types'
import Food from '../models/Food.model'

class FoodRequestService implements IFoodRequestService {
  addFoodRequest = async (requestedBy: string, foodId: string) => {
    try {
      const food = await Food.findById(foodId)

      if (!food) throw Err.setStatus('BadRequest').setMessage('Food not found')
      else if (food.authorEmail === requestedBy)
        throw Err.setStatus('BadRequest').setMessage(
          'You cannot request your own food'
        )

      return await FoodRequest.create({ foodId, requestedBy })
    } catch (error: MongooseError | any) {
      if (error instanceof Err) throw error
      else if (error instanceof MongooseError)
        throw Err.setStatus('InternalServerError').setMessage(error.message)
      else if (error?.name === 'MongoServerError' && error?.code === 11000) {
        throw Err.setStatus('Conflict').setMessage('Food already requested')
      }

      throw Err.setStatus('InternalServerError').setWhere(
        'addFoodRequest service - unknown error'
      )
    }
  }
}

const foodRequestService = new FoodRequestService()

export default foodRequestService
