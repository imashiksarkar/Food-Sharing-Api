import mongoose from 'mongoose'
import env from './env.config'
import healthController from '../controllers/health.controller'

class DBConfig {
  private isConnected = 0

  async connect() {
    if (this.isConnected) {
      console.log('Reusing existing database connection')
      return
    }

    try {
      const db = await mongoose.connect(env.DB_CoNNECTION_URL, {
        family: 4,
        authSource: 'admin',
        serverSelectionTimeoutMS: 5000,
      })
      this.isConnected = db.connections[0].readyState
      console.log('Database connected')
    } catch (error) {
      healthController.setHealth(500, 'Database connection error')
      console.error('Database connection error:', error)
      process.exit(1)
    }
  }
}

const dbConfig = new DBConfig()

export default dbConfig
