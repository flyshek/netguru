const configuration = {
	files: ['tests/**/*'],
	failFast: false,
	failWithoutAssertions: false,
	verbose: false,
	concurrency: 2,
	tap: false,
	cache: true,
	extensions: ['ts'],
	require: ['ts-node/register', 'tsconfig-paths/register'],
	environmentVariables: {
		NODE_ENV: 'CI',
	},
}

export default configuration
