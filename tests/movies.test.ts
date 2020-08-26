import AnyTest, { TestInterface } from 'ava'
import http from 'http'
import listen from 'test-listen'
import got from 'got'

// NOTE: This test assumes there is MongoDB running, tbh I was lazy to implement
// there some memory mongodb, implement connection and perform tests.

// Create basic testing context with Main Class and exported express instance.
import { Main } from '@netguru/server'
import { omdbResponse } from '@netguru/movies'
import { omdbMovie } from 'movies/omdb.interface'
import { IMovie } from 'movies/movie.model'
const { app } = new Main()

// Interface for types in our tests
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

	t.deepEqual(internalRequest.data, externalResponse.Search, 'API should featch data from external API')
})

test.serial('POST /movies should return status 200', async (t) => {
	const moviesRequest = await got('movies', {
		prefixUrl: t.context.prefixUrl,
	})
	t.is(moviesRequest.statusCode, 200)
})

test.serial('GET /movies should return created movies', async (t) => {})

test.serial('GET /movies should return status 200', async (t) => {})
