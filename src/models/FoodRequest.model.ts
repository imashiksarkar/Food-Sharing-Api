import mongoose, { model, Schema } from 'mongoose'
import {
  IFoodRequest,
  IFoodRequestDocument,
  IFoodRequestModel,
} from '../types/foodRequest.types'

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const foodRequestSchema = new Schema<IFoodRequestDocument>(
  {
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Food id is required.'],
    },
    requestedBy: {
      type: String,
      trim: true,
      required: [true, 'Requestor email is required.'],
      match: [emailRegex, 'Author email must be valid.'],
    },
    status: {
      type: String,
      trim: true,
      default: 'pending',
      lowercase: true,
      enum: {
        values: ['pending', 'accepted', 'rejected', 'delivered', 'cancelled'],
        message: 'Status must be one of the following values: {VALUE_ARRAY}.',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

foodRequestSchema.index({ foodId: 1, requestedBy: 1 }, { unique: true })

const FoodRequestModel = model<IFoodRequestDocument, IFoodRequestModel>(
  'FoodRequest',
  foodRequestSchema
)

export default class FoodRequest extends FoodRequestModel {
  constructor(private input: IFoodRequest) {
    super(input)
  }
}
