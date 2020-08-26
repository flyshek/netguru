import dotenv from 'dotenv'
import { isDevelopmentCheck, isProductionCheck } from './helpers'

dotenv.config()

export const NODE_ENV = process.env.NODE_ENV! || 'development'
export const HOST = process.env.HOST! || 'localhost'

// eslint-disable-next-line radix
export const PORT = Number.parseInt(process.env.PORT!) || 3600

// Database Configuration
export const MONGODB_URI = process.env.MONGODB_URI! || 'mongodb://localhost'

// ENV-based Lifecycle Variables
export const isDevelopment = isDevelopmentCheck()
export const isProduction = isProductionCheck()
