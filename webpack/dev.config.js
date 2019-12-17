const path = require('path')

const config = require('./common.config')

const devConfig = Object.assign({}, config, {
	devtool: 'eval',
	mode: 'development',
	output: Object.assign({}, config.output, {
		path: path.resolve('./dev/static')
	})
})

module.exports = devConfig
