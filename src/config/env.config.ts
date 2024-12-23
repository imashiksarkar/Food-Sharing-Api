import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config({
  path: './.env.local',
})

const envParser = z.object({
  APP_NAME: z.string().trim().min(2, 'App name must be 3 chars or more.'),
  PORT: z
    .string()
    .transform((port) => parseInt(port))
    .refine((port) => !isNaN(port), { message: 'Port Must Be Number.' }),
  DB_CoNNECTION_URL: z.string().trim().url('Invalid Database URL.'),
})

const { success, data, error } = envParser.safeParse(process.env)

if (!success) {
  console.error(JSON.stringify(error?.errors))
  process.exit(1)
}

export default data satisfies typeof data
