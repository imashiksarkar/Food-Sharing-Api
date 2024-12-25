import mongoose, { Document, Model } from 'mongoose'
// import z from 'zod'
// import addFoodDto from '../dtos/food.dto'

// export type AddFoodDto = z.infer<typeof addFoodDto>

// mongoose input data
export interface IFoodRequest {
  foodId: mongoose.Schema.Types.ObjectId
  requestedBy: string // email
  status?: 'pending' | 'accepted' | 'rejected' | 'delivered' | 'cancelled'
}

export interface IEligibility {
  foodId: string
  requestedBy: string
  isEligible: boolean
}

// data from database
export interface IFoodRequestDocument extends Document, IFoodRequest {
  _id: string
  createdAt: Date
  updatedAt: Date
}

// methods available in the model
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IFoodRequestModel extends Model<IFoodRequestDocument> {}

export interface IFoodRequestService {
  addFoodRequest: (
    requestedBy: string,
    foodId: string
  ) => Promise<IFoodRequestDocument>
}
