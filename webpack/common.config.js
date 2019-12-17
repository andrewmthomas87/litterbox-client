const path = require('path')
const webpack = require('webpack')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')

const config = {
	context: path.resolve('./src'),
	entry: { app: '.' },
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: 'ts-loader'
			},
			{
				test: /\.less$/,
				use: [
					MiniCSSExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: { modules: 'local' }
					},
					'less-loader'
				]
			}
		]
	},
	output: {
		filename: '[name].js',
		publicPath: '/static/'
	},
	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new MiniCSSExtractPlugin({ filename: '[name].css' })
	],
	resolve: {
		extensions: ['.js', '.ts', '.tsx'],
		modules: [
			path.resolve('./src'),
			'node_modules'
		]
	},
	target: 'web'
}

module.exports = config
