import express from 'express'
import corsConfig from './config/cors.config'
import './config/env.config'
import dbConfig from './config/mongo.config'
import errorMiddleware from './middlewares/error.middleware'
import routes from './routes'
import cookieParser from 'cookie-parser'

const app = express()

app.use(corsConfig())

app.use(cookieParser())
app.use(express.json())

dbConfig.connect()

app.use(routes)

app.use(errorMiddleware())

export default app
