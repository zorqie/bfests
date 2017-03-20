const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

module.exports = {

	entry: path.resolve(__dirname, 'src/index.js'),

	output: {
		filename: 'src/server.bundle.js'
	},

	target: 'node',

	// keep node_module paths out of the bundle
	externals: 
		fs.readdirSync(path.resolve(__dirname, 'node_modules'))
		.concat([
			'react-dom/server', 'react/addons',
		])
		.reduce(function (ext, mod) {
			ext[mod] = 'commonjs ' + mod
			return ext
		}, {}),

	node: {
		__filename: true,
		__dirname: true,
		window: true
	},

	module: {
		rules: [
			{ 
				test: /\.js[oxn]*$/, 
				exclude: /node_modules/, 
				use: [{loader: 'babel-loader'}]
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			"window": "process"
		})
	]

}