import { model, Schema } from 'mongoose'
import { foodCategory } from '../dtos/food.dto'
import { IFood, IFoodDocument, IFoodModel } from '../types/food.types'

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const foodSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required.'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Description is required.'],
    },
    imageUrl: {
      type: String,
      trim: true,
      required: [true, 'Image is required.'],
    },
    category: {
      type: String,
      trim: true,
      required: [true, 'Category is required.'],
      enum: foodCategory,
    },
    expiresAt: {
      type: Date,
      trim: true,
      required: [true, 'Expires at is required.'],
    },
    authorEmail: {
      type: String,
      required: [true, 'Author email is required.'],
      trim: true,
      validate: {
        validator: (authorEmail: string) => emailRegex.test(authorEmail),
        message: 'Author email must be valid.',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

const FoodModel = model<IFoodDocument, IFoodModel>('Food', foodSchema)

export default class Food extends FoodModel {
  constructor(private input: IFood) {
    super(input)
  }
}
