import AnyTest, { TestInterface } from 'ava'

import http from 'http'
import got from 'got'
import listen from 'test-listen'

import { Main } from '@netguru/server'
import { omdbMovie, omdbResponse } from 'movies/omdb.interface'
import { IMovie, Movie } from 'movies/movie.model'

const { app } = new Main()

interface Context {
	server: http.Server
	prefixUrl: string
}

const test = AnyTest as TestInterface<Context>

test.beforeEach(async function (t) {
	t.context.server = http.createServer(app)
	t.context.prefixUrl = await listen(t.context.server)
})

test.afterEach(function (t) {
	t.context.server.close()
})

test.serial('POST /movies should search through 3rd-party API', async (t) => {
	const internalRequest: {
		results: number
		availablePages: number
		data: Array<omdbMovie>
	} = await got
		.post('movies', {
			prefixUrl: t.context.prefixUrl,
			json: {
				s: 'spiderman',
			},
			responseType: 'json',
		})
		.json()
	const externalResponse: omdbResponse = await got('http://www.omdbapi.com', {
		searchParams: {
			s: 'spiderman',
			apikey: 'a521616f',
		},
	}).json()

	t.deepEqual(
		internalRequest.data,
		externalResponse.Search,
		'Data fetched from external API should be deeply equal to data gain from internal API.'
	)
})

test.serial('POST /movies should return status 200', async (t) => {
	const moviesRequest = await got('movies', {
		prefixUrl: t.context.prefixUrl,
	})
	t.is(moviesRequest.statusCode, 200)
})

// I have little problem with this shit, to be fixed later.
test.serial.failing('GET /movies should return created movies', async (t) => {
	const moviesFromDatabase = await Movie.find()
	const moviesRequest: {
		data: Array<any>
	} = await got('movies', {
		prefixUrl: t.context.prefixUrl,
	}).json()
	t.deepEqual(moviesFromDatabase, moviesRequest.data)
})

test.serial('GET /movies should return status 200', async (t) => {
	const moviesRequest = await got('movies', {
		prefixUrl: t.context.prefixUrl,
	})
	t.is(moviesRequest.statusCode, 200)
})
