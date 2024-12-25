import { Err } from 'http-staror'
import mongoose, { MongooseError } from 'mongoose'
import FoodRequest from '../models/FoodRequest.model'
import { IEligibility, IFoodRequestService } from '../types/foodRequest.types'
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

      const isEligible = await FoodRequest.aggregate<IEligibility>([
        {
          $match: {
            foodId: new mongoose.Types.ObjectId('676b2d800555baf7756d29f3'),
            requestedBy: 'contact@ashiksarkar.xyz',
          },
        },
        {
          $group: {
            _id: 'status',
            status: {
              $addToSet: '$status',
            },
            foodIds: {
              $addToSet: '$foodId',
            },
            requestedBy: {
              $addToSet: '$requestedBy',
            },
          },
        },
        {
          $project: {
            _id: 0,
            foodId: {
              $toString: {
                $arrayElemAt: ['$foodIds', 0],
              },
            },
            requestedBy: {
              $arrayElemAt: ['$requestedBy', 0],
            },
            isEligible: {
              $allElementsTrue: {
                $map: {
                  input: '$status',
                  as: 'currentStatus',
                  in: {
                    $eq: ['$$currentStatus', 'cancelled'],
                  },
                },
              },
            },
          },
        },
      ])

      if (isEligible.length > 0 && !isEligible[0].isEligible)
        throw Err.setStatus('BadRequest').setMessage('Food already requested')

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
