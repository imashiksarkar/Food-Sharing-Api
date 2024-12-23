import { Document, Model } from 'mongoose'
import z from 'zod'
import addFoodDto from '../dtos/food.dto'

export type AddFoodDto = z.infer<typeof addFoodDto>

// mongoose input data
export interface IFood extends AddFoodDto {
  authorEmail: string
}

// data from database
export interface IFoodDocument extends Document, IFood {
  _id: string
  createdAt: Date
  updatedAt: Date
}

// methods available in the model
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IFoodModel extends Model<IFoodDocument> {}

export interface FoodRes<T> {
  data: T | null
  error: string | null
}

export interface IFoodService {
  addFood: (
    authorEmail: string,
    foodInput: AddFoodDto
  ) => Promise<FoodRes<IFoodDocument>>
  findAllFoods: () => Promise<FoodRes<IFoodDocument[]>>
  findFoodById: (id: string) => Promise<FoodRes<IFoodDocument | null>>
  // deleteFoodById: (id: string) => Promise<FoodRes<IFoodDocument | null>>
  // updateFoodById: (
  //   id: string,
  //   foodInput: AddFoodDto
  // ) => Promise<FoodRes<IFoodDocument | null>>
  // findFoodsByAuthorEmail: (
  //   authorEmail: string
  // ) => Promise<FoodRes<IFoodDocument[]>>
  // findFoodsByCategory: (
  //   category: string
  // ) => Promise<FoodRes<IFoodDocument[]>>
  // findFoodsByExpiresAt: (
  //   expiresAt: Date
  // ) => Promise<FoodRes<IFoodDocument[]>>
}
