import { IAuthService, AuthDtoType } from '../types/auth.types'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import env from '../config/env.config'

export default class AuthService implements IAuthService {
  generateToken = ({ name, email, photoUrl }: AuthDtoType) => {
    try {
      const token = jwt.sign({ name, email, photoUrl }, env.JWT_SECRET, {
        expiresIn: '1h',
      })

      return { token, error: null }
    } catch (error: unknown | JsonWebTokenError) {
      if (error instanceof JsonWebTokenError) return { token: null, error }
      return { token: null, error: 'Unknown token error!' }
    }
  }
}
