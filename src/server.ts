import app from './app'
import env from './config/env.config'

app.listen(env.PORT, () => {
  console.log(`Server is running at http://localhost:${env.PORT} - v1.0.0`)
})
