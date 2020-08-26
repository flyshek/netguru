import express from 'express'
import compression from 'compression'
import cors from 'cors'
import signale from 'signale'
import morgan from 'morgan'
import mongoose from 'mongoose'
import errorHandler from 'errorhandler'

import { HOST, isDevelopment, NODE_ENV, PORT, MONGODB_URI } from '@netguru/env'

import { MovieRouter } from '@netguru/movies'
import { CommentRouter } from '@netguru/comments'

// TBH, I don't know which technology stack you expected, so I'll use my
// personal prefereneces (not at all, but in general). Why you're doing that on
// class?! Code in class can be inhreited which saves some time in development
// and as well reduces code complexity in my optionion, probably flex with DDD
// and DI would be best option, but imho DDD isn't that good at all.

// There can occur multiple questions like for ffs this guy is using ex.
// signale, just incrasing bundle size - don't worry.

// And now seriously... Singale is cool option for looging because I can easly
// disable all of my logs while I'm testing application, and sorting my
// console.logs with scopes and statuses, additionally it looks cool so, worth.

export class Main {
	/** Express Application Instance */
	public app: express.Application

	// I've put everything to constructor, because I don't wanna care what was
	// exectured and what was not, in normal env probably I would like to split
	// listen().
	constructor() {
		this.app = express()
		this.middleware()
		this.routing()
		this.database()
	}

	// If you gonna think why there is no types, I'm gonna answer you atm -
	// there is no types becasue adding type to specifc methods in this class
	// doesn't have sense - there are build-in Promise<void>/void type.

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

		// You have also not specified database that should be used for task, so
		// I'm going through one of my favs - MongoDB, there is an common
		// implementation of mongoose connection from my other project, with
		// basic error handling based on signale library.

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
