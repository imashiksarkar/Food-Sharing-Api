import { Err } from 'http-staror'
import mongoose, { MongooseError } from 'mongoose'
import Food from '../models/Food.model'
import FoodRequest from '../models/FoodRequest.model'
import {
  IEligibility,
  IFoodRequestDocument,
  IFoodRequestService,
  IUpdateFoodRequestStatusInput,
  Permissions,
  StatusEnumType,
} from '../types/foodRequest.types'
import { IFoodDocument } from '../types/food.types'

class FoodRequestService implements IFoodRequestService {
  addFoodRequest = async (requestedBy: string, foodId: string) => {
    const foodSession = await Food.startSession()
    try {
      await foodSession.startTransaction()
      const food = await Food.findById(foodId)

      if (!food) {
        await foodSession.abortTransaction()
        throw Err.setStatus('BadRequest').setMessage('Food not found')
      } else if (food.authorEmail === requestedBy) {
        await foodSession.abortTransaction()
        throw Err.setStatus('BadRequest').setMessage(
          'You cannot request your own food'
        )
      }

      const isEligible = await FoodRequest.aggregate<IEligibility>([
        {
          $match: {
            food: new mongoose.Types.ObjectId(foodId),
            requestedBy,
          },
        },
        {
          $group: {
            _id: 'status',
            status: {
              $addToSet: '$status',
            },
            foodIds: {
              $addToSet: '$food',
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

      if (isEligible.length > 0 && !isEligible[0].isEligible) {
        await foodSession.abortTransaction()
        throw Err.setStatus('BadRequest').setMessage('Food already requested')
      }

      const foodRequest = await FoodRequest.create({
        food: foodId,
        requestedBy,
      })

      await Food.updateOne(
        { _id: foodId },
        { $set: { foodStatus: 'unavailable' } },
        { session: foodSession }
      )

      await foodSession.commitTransaction()

      return foodRequest

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: MongooseError | any) {
      if (foodSession.inTransaction()) await foodSession.abortTransaction()

      if (error instanceof Err) throw error
      else if (error instanceof MongooseError)
        throw Err.setStatus('InternalServerError').setMessage(error.message)
      else if (error?.name === 'MongoServerError' && error?.code === 11000) {
        throw Err.setStatus('Conflict').setMessage('Food already requested')
      }

      throw Err.setStatus('InternalServerError').setWhere(
        'addFoodRequest service - unknown error'
      )
    } finally {
      await foodSession.endSession()
    }
  }

  updateFoodRequestStatus = async ({
    status,
    user,
    foodRequestId,
  }: IUpdateFoodRequestStatusInput) => {
    try {
      const foodRequest = await FoodRequest.findOne({
        _id: foodRequestId,
        status: { $in: ['pending', 'accepted'] },
      }).populate('food')

      if (!foodRequest)
        throw Err.setStatus('NotFound').setMessage('Food request not found')

      const userType = this.getUserType(foodRequest, user)

      const oldStatus = foodRequest.status
      if (!this.allowedStatus(userType, oldStatus).includes(status))
        throw Err.setStatus('Unauthorized').setMessage('Permission denied')

      const updatedFood = await foodRequest.updateOne({ status })
      if (
        updatedFood.status === 'delivered' ||
        updatedFood.status === 'accepted'
      ) {
        await Food.findOneAndUpdate(
          { _id: foodRequest.food },
          {
            foodStatus: 'unavailable',
          }
        )
      }

      return updatedFood

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: MongooseError | any) {
      if (error instanceof Err) throw error
      else if (error instanceof MongooseError)
        throw Err.setStatus('InternalServerError').setMessage(error.message)

      throw Err.setStatus('InternalServerError').setWhere(
        'updateFoodRequestStatus service - unknown error'
      )
    }
  }

  fetchFoodRequestsByRequestor = async (requestorEmail: string) => {
    try {
      return await FoodRequest.find({ requestedBy: requestorEmail })
        .populate('food')
        .sort({ updatedAt: -1 })
    } catch (error: MongooseError | unknown) {
      if (error instanceof Err) throw error
      else if (error instanceof MongooseError)
        throw Err.setStatus('InternalServerError').setMessage(error.message)
      throw Err.setStatus('InternalServerError').setWhere(
        'fetchFoodRequestsByRequestor service - unknown error'
      )
    }
  }

  findFoodRequestsByFoodId = async (foodId: string, authorEmail: string) => {
    try {
      return await FoodRequest.aggregate([
        {
          $match: {
            food: new mongoose.Types.ObjectId(foodId),
          },
        },
        {
          $lookup: {
            from: 'foods',
            localField: 'food',
            foreignField: '_id',
            as: 'result',
          },
        },
        {
          $project: {
            _id: 1,
            requestedBy: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            food: {
              $arrayElemAt: ['$result', 0],
            },
          },
        },
        {
          $project: {
            _id: 1,
            requestedBy: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            authorEmail: '$food.authorEmail',
          },
        },
        {
          $match: {
            authorEmail,
          },
        },
        {
          $sort: {
            updatedAt: -1,
          },
        },
      ])
    } catch (error: MongooseError | unknown) {
      if (error instanceof Err) throw error
      else if (error instanceof MongooseError)
        throw Err.setStatus('InternalServerError').setMessage(error.message)
      throw Err.setStatus('InternalServerError').setWhere(
        'findFoodRequestsByFoodId service - unknown error'
      )
    }
  }

  private getUserType = (foodRequest: IFoodRequestDocument, user: string) => {
    if (foodRequest.requestedBy === user) return 'requester'
    else if (
      (foodRequest.food as unknown as IFoodDocument).authorEmail === user
    )
      return 'author'

    return null
  }

  private allowedStatus = (
    userType: 'requester' | 'author' | null,
    oldStatus: StatusEnumType
  ) => {
    if (!userType) return []
    return this.permissions[userType]?.[oldStatus] ?? []
  }

  private permissions: Permissions = {
    requester: {
      pending: ['cancelled'],
    },
    author: {
      pending: ['accepted', 'rejected'],
      accepted: ['delivered'],
    },
  }
}

const foodRequestService = new FoodRequestService()

export default foodRequestService
