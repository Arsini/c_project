const common = require('./common.js');
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const resolve = (dir) => ( path.join(__dirname, '..', ...dir) );
const port = 4009
const os = require('os');
function getLocalIps(flagIpv6) {
	const ifaces = os.networkInterfaces();
	const ips = [];
	const func = function (details) {
		if (!flagIpv6 && details.family === 'IPv6') {
			return;
		}
		ips.push(details.address);
	};
	for (let dev in ifaces) {
		ifaces[dev].forEach(func);
	}
	return ips[0];
}

module.exports = merge(common, {
	devtool: 'source-map',
	output: {
        path: resolve(['dist']),
        filename: `[name].js`,
        chunkFilename: `[name].js`,
        publicPath: '/dist/',
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'vue',
            },
            {
                test: /\.css$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    'style',
                    'css',
                    'postcss',
                ]
            },
        ],
    },
    resolveLoader: {
	    moduleExtensions: ['-loader'],
    },
    plugins: [
    	new HtmlWebpackPlugin({
			template: resolve(['src', 'index.html']),
			filename: 'index.html',
        }),
        new FriendlyErrorsWebpackPlugin({
			clearConsole: true,
			compilationSuccessInfo: {
				messages: [`You application is running here http://${getLocalIps()}:${port}`]
			},
		}),
    ],
    devServer: {
		port,
        // clientLogLevel: 'warning',
        open: true,
        overlay: true,
        quiet: true,
		host: getLocalIps(),
    },
})