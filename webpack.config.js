const configure = require('craftpack')
const path = require('path')

const NodemonPlugin = require('nodemon-webpack-plugin')

// What the heck you're using?
// I'm using webpack for most of my projects, from some time I've used that on
// back-end which can be considered as a bad practice, don't worry. At this
// point I'm going to use it as build command since there I have prepared
// configuration for TypeScript Node applications.

// P.S. Craftpack is my early library, just saving some time.
// https://github.com/keinsell/craftpack

module.exports = configure({
	output: {
		filename: 'index.js',
		path: path.join(__dirname, 'dist'),
	},
	entry: path.join(__dirname, 'src', 'bin', 'http.ts'),
	plugins: [new NodemonPlugin()],
})
