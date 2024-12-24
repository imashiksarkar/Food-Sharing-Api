import z from 'zod'

export const foodCategory = [
  'breakfast',
  'lunch',
  'dinner',
  'snacks',
  'drinks',
] as const

const getMinDate = () => {
  const date = new Date()
  date.setMinutes(date.getMinutes() + 30) // add 30 minutes
  return date
}

const addFoodDto = z.object({
  name: z.string().trim().min(3, 'Name must be 3 chars or more.'),
  imageUrl: z.string().trim().url('Invalid url.'),
  category: z.enum(foodCategory),
  expiresAt: z.preprocess(
    (value) => (typeof value === 'string' ? new Date(value) : value),
    z
      .date()
      .min(getMinDate(), 'Expires at must be at least 30 minutes from now.')
  ),
  pickupLocation: z
    .string()
    .trim()
    .min(3, 'Pickup location must be 3 chars or more.'),
  additionalNotes: z
    .string()
    .trim()
    .min(3, 'Additional notes must be 3 chars or more.'),
})



export default addFoodDto
