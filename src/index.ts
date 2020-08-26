/* eslint-disable @typescript-eslint/no-floating-promises */

import express from 'express'
import compression from 'compression'
import cors from 'cors'
import signale from 'signale'
import morgan from 'morgan'
import mongoose from 'mongoose'
import errorHandler from 'errorhandler'

import { HOST, isDevelopment, NODE_ENV, PORT, MONGODB_URI, isProduction } from '@netguru/env'

import { MovieRouter } from '@netguru/movies'
import { CommentRouter } from '@netguru/comments'

import { logger } from './middleware/winston.middleware'

export class Main {
	/** Express Application Instance */
	public app: express.Application

	constructor() {
		this.app = express()
		this.middleware()
		this.routing()
		this.database()
	}

	/**
	 * Method that listens on specified PORT in .env, in case of missing ENV
	 * Variable server will listen on port 3600.
	 */
	public listen() {
		this.app.listen(PORT, () => {
			signale.success(`(${NODE_ENV}) listening on http://${HOST}:${PORT}`)
		})
	}

	/**
	 * Method that holds middleware configuration for express.Application
	 * instance.
	 */
	private middleware() {
		this.app.use(express.json())
		this.app.use(express.urlencoded({ extended: false }))
		this.app.use(cors())
		this.app.use(compression())
		if (isProduction) this.app.use(logger)
		if (isDevelopment) this.app.use(morgan('dev'))
		if (isDevelopment) this.app.use(errorHandler())
	}

	private routing() {
		this.app.use('/movies', new MovieRouter().router)
		this.app.use('/comments', new CommentRouter().router)
	}

	private async database() {
		// Implementation of scoped logger, disabled in testing.
		const logger = signale.scope('mongodb')
		if (NODE_ENV === 'CI') logger.disable()

		mongoose.connection.on('connected', () => {
			logger.success('connected to database.')
		})

		mongoose.connection.on('reconnected', () => {
			logger.success('reconnected to database.')
		})

		mongoose.connection.on('disconected', () => {
			logger.warn('cisconected from database.')
			logger.info('reconnecting to database...')
			setTimeout(async () => {
				await mongoose.connect(MONGODB_URI, {
					keepAlive: true,
					socketTimeoutMS: 3000,
					connectTimeoutMS: 3000,
					useUnifiedTopology: true,
					useNewUrlParser: true,
				})
			}, 3000)
		})

		mongoose.connection.on('close', () => {
			logger.log('connection closed.')
		})

		mongoose.connection.on('error', (error) => {
			logger.error('database error \n', error)
		})

		await mongoose
			.connect(MONGODB_URI, {
				useCreateIndex: true,
				keepAlive: true,
				useUnifiedTopology: true,
				useNewUrlParser: true,
			})
			.catch((error) => {
				logger.error('cannot connect to database')
				logger.log(error)
			})
	}
}
