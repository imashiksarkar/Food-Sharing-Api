import { Request, Response } from 'express'

class Health {
  private statusCode = 200
  private status = 'UP'

  healthCheck = (_req: Request, res: Response) => {
    res.status(this.statusCode).json({
      statusCode: this.statusCode,
      status: this.status,
    })
  }

  getHealth = () => ({
    statusCode: this.statusCode,
    status: this.status,
  })

  setHealth = (statusCode: number, status: string) => {
    this.statusCode = statusCode
    this.status = status
    return true
  }
}

const healthController = new Health()

export default healthController
