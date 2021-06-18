import AnyTest, { TestInterface } from 'ava'
import http from 'http'
import listen from 'test-listen'
import got from 'got'

// Create basic testing context with Main Class and exported express instance.
import { Main } from '@keinsell/server'
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

test.serial.todo('POST /comment should create new entry')
test.serial.todo('POST /comment should return status 200')
test.serial.todo('GET /comment should return created comments')
test.serial.todo('GET /comment should return status 200')
