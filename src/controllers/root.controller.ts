import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'

class RootController {
  root = catchAsync(async (_req: Request, res: Response) => {
    res.status(200).json({
      message: 'Welcome to the Food Sharing API 🚀',
    })
  })
}

const rootController = new RootController()

export default rootController
