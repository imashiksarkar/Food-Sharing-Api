import z from 'zod'
import authDto from '../dtos/auth.dto'
import { JsonWebTokenError } from 'jsonwebtoken'

export type AuthDtoType = z.infer<typeof authDto>

export interface IAuthService {
  generateToken: (input: AuthDtoType) => {
    token: string | null
    error: (JsonWebTokenError | string) | null
  }
}
