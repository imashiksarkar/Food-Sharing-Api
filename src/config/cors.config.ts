import cors from 'cors'

const corsConfig = () =>
  cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    maxAge: 3600,
    credentials: true,
  })

export default corsConfig
