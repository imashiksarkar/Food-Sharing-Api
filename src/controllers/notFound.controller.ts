import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'

class NotFoundController {
  notFound = catchAsync(async (req: Request, res: Response) => {
    res.status(404).json({
      message: 'Not Found',
      path: req.url,
    })
  })
}

const notFoundController = new NotFoundController()

export default notFoundController
