// At general, I'm usually splitting files as much as it's possible when they
// gets arround ~250 lines (when it's possible ofc to don't break
// Single-Responsiblity Rule). In this case I've merged controller class and
// router class into one file since splitting them will introduce just more mess.

import { Request, Response, Router } from 'express'
import { Movie, IMovie } from './movie.model'

// I using 'got' library since commonly used 'request' is no logner maintained,
// idk why people are still using it.

import got from 'got'
import signale from 'signale'

// There are some types for responses from omdb, since this simplifies my
// workflow a lot.
import { omdbResponse, omdbMovie } from './omdb.interface'
import { NODE_ENV } from '@netguru/env'

const logger = signale.scope('movies')

// If you're testing my app and see multiple logs, and you wonder how that shit
// can be even readable on production - my answer is simple, it's just
// development tooling, on production we can easly signale logs.

if (NODE_ENV === 'CI' || NODE_ENV === 'production') logger.disable()

export interface MovieSearchResponse {
	results: number
	availablePages: number
	data: Array<omdbMovie>
}

export class MovieRouter {
	public controller: MovieController = new MovieController()
	public router: Router = Router()

	constructor() {
		this.router
		this.routes()
	}

	private routes() {
		this.router.get('/', this.controller.getAll)
		this.router.post('/', this.controller.createOne)
	}
}

class MovieController {
	/**
	 * Gets informations from http://www.omdbapi.com basend on passed query
	 * params in body, then stores files in database and returns entry from
	 * database to client.
	 * @param req {Request}
	 * @param res {Response}
	 */
	async createOne(req: Request, res: Response) {
		// Perform request to get data from website.
		const responseFromWebsite: omdbResponse = await got('http://www.omdbapi.com', {
			searchParams: {
				...req.body,
				// I'm not hidding that key in .env since it's not a sensitive
				// data for me and probably I'll not use this website anymore,
				// and additionally that will save some mess for people who will
				// be checking that code.
				apikey: 'a521616f',
			},
		}).json()

		// Maybe there we should consume pagintation by parsing request counter
		// and rolling request by pages, numberOfPages = numberOfRequests/10 and
		// loop this request to consume all things.

		// const numberOfPages = parseInt(responseFromWebsite.totalResults) / 10
		// for (let index = 1; index < numberOfPages; index++) {
		// 	const request = await got('http://www.omdbapi.com', {
		// 		searchParams: {
		// 			...req.body,
		// 			page: index,
		// 			apikey: 'a521616f',
		// 		},
		// 	}).json()
		// 	// And code that was used below.
		// }

		// Maybe I'm just overthinking provided spec, lol.
		// What a spaggetti!

		if (responseFromWebsite.Response === 'False') {
			res.status(404).json({ err: responseFromWebsite.Error })
		} else {
			responseFromWebsite.Search.map(async (movie) => {
				// Search for movie in database using created index on imdbID.
				const searchMovieInDatabase = await Movie.findOne({ imdbID: movie.imdbID })

				if (searchMovieInDatabase == null) {
					const newMovie = new Movie(movie)
					await newMovie
						.save()
						.then(() => {
							logger.success('Created missing movie', newMovie.Title)
						})
						.catch((err) => {
							logger.error(`Error when creating ${newMovie.Title}`, err)
						})
				} else {
					logger.info('Movie actually exist in database', movie.Title)
				}
			})

			const totalResults = parseInt(responseFromWebsite.totalResults)

			// Maybe you wanted to scrap data, actually I'm going to return an
			// amount of pages, you can go arround and use page manipulation
			// with "page" entry in body.

			res.json({
				results: totalResults,
				availablePages: Math.round(totalResults / 10),
				data: responseFromWebsite.Search,
			})
		}
	}

	async getAll(req: Request, res: Response) {
		const movies = await Movie.find().populate('Comment').exec()
		res
			.json({
				data: movies,
			})
			.status(200)
	}
}
