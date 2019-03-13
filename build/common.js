const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const chalk = require('chalk')
const resolve = (dir) => (path.join(__dirname, '..', ...dir));

module.exports = {
    entry: {
        main: resolve(['src', 'main.js']),
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
                exclude: /(node_modules|bower_components)/,
                // use: {
                //     loader: 'url',
                //     options: {
                //         limit: 6144,
                //         name: 'static/[name].[hash:8].[ext]',
                //     },
                // },
                use:[
                    {
                        loader: 'url-loader',
                            options: {
                                limit: 6144,
                                name: 'static/[name].[hash:8].[ext]',
                        }
                    },
                    'image-webpack-loader', // 压缩图片
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                exclude: /(node_modules|bower_components)/,
                use: [{
                    loader: "url",
                    options: {
                        limit: 6144,
                        name: "static/[name].[hash:8].[ext]",
                    }
                }]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                exclude: /(node_modules|bower_components)/,
                use: [{
                    loader: "url",
                    options: {
                        limit: 6144,
                        name: "static/[name].[hash:7].[ext]",
                    }
                }]
            },
       ]
    },
    plugins: [
        new ProgressBarPlugin({
            clear: false,
            format: ' running [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)' + ' (:eta completion)',
        })
    ],
    stats: "errors-only",
    resolveLoader: {
	    moduleExtensions: ['-loader'],
    },
    resolve: {
        alias: {
            pages: resolve(['src', 'pages']),
            components: resolve(['src', 'components']),
            'lib': resolve(['src', 'lib']),
            'css': resolve(['src', 'assets', 'css']),
            'img': resolve(['src', 'assets', 'images']),
        },
        extensions: ['.js', '.vue',],
    },
}