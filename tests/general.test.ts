import AnyTest, { TestInterface } from 'ava'
import http from 'http'
import listen from 'test-listen'
import got from 'got'

// In corporate enviroment I would rather use Jest or Mocha+Chai but my personal
// preference is ava since it's damn simple and integration with TAP Reporter
// makes it really customizable.

// Create basic testing context with Main Class and exported express instance.
import { Main } from '@netguru/server'
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

// Generally there is no need for serial testing, concurrent tests are fine.

test('GET / should return body equal to "Hello Netguru!"', async (t) => {
	const request = await got(t.context.prefixUrl).json()
	t.is(request, 'Hello Netguru!')
})

test('GET / should return return status 200', async (t) => {
	const request = await got(t.context.prefixUrl)
	t.is(request.statusCode, 200)
})
