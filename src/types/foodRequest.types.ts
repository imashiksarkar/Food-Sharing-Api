import mongoose, { Document, Model } from 'mongoose'
// import z from 'zod'
// import addFoodDto from '../dtos/food.dto'

// export type AddFoodDto = z.infer<typeof addFoodDto>

export type StatusEnumType =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'delivered'
  | 'cancelled'
// mongoose input data
export interface IFoodRequest {
  food: mongoose.Schema.Types.ObjectId
  requestedBy: string // email
  status: StatusEnumType
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

export interface IUpdateFoodRequestStatusInput {
  user: string
  foodRequestId: string
  status: Exclude<StatusEnumType, 'pending'>
}

export type Permissions = {
  [key in 'requester' | 'author']: {
    [key in StatusEnumType]?: Exclude<StatusEnumType, 'pending'>[]
  }
}

export interface IFoodRequestService {
  addFoodRequest: (
    user: string, //email
    foodId: string
  ) => Promise<IFoodRequestDocument>

  updateFoodRequestStatus: (
    input: IUpdateFoodRequestStatusInput
  ) => Promise<IFoodRequestDocument | null>

  fetchFoodRequestsByRequestor: (
    requestorEmail: string
  ) => Promise<IFoodRequestDocument[]>

  findFoodRequestsByFoodId: (
    foodId: string,
    authorEmail: string
  ) => Promise<IFoodRequestDocument[]>
}
