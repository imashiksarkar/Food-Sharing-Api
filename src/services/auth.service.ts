import { IAuthService, AuthDtoType } from '../types/auth.types'
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken'
import env from '../config/env.config'

class AuthService implements IAuthService {
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

  verifyToken = (token: string) => {
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload
      if (typeof payload === 'string') throw 'Unknown token error!'

      return {
        data: payload,
        error: null,
      }
    } catch (error: unknown | JsonWebTokenError) {
      if (error instanceof JsonWebTokenError) return { data: null, error }
      return { data: null, error: (error as string) || 'Unknown token error!' }
    }
  }
}

const authService = new AuthService()

export default authService
