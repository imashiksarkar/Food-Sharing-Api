import z from 'zod'

const updateFoodRequestDto = z.object({
  status: z.enum(['accepted', 'rejected', 'delivered', 'cancelled']),
})

export default updateFoodRequestDto
