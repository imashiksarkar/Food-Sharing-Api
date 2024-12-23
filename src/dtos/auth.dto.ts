import z from 'zod'

const authDto = z.object({
  name: z.string().trim().min(3, 'Name must be 3 chars or more.'),
  email: z.string().trim().email('Invalid email.'),
  photoUrl: z.string().trim().url('Invalid photo url.').optional(),
})

export default authDto
