const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./common.js');
const CleanPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const resolve = (dir) => (path.join(__dirname, '..', ...dir));

module.exports = merge(common, {
    devtool: false,
    output: {
        path: resolve(['dist']),
        filename: `static/[name].[chunkhash:7].js`,
        chunkFilename: `static/[name].[chunkhash:7].js`,
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new HtmlWebpackPlugin({
            template: resolve(['src', 'index.html']),
            filename: 'index.html',
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency',
            // minify: {
                // removeComments: true,
                // collapseWhitespace: true,
                // removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            // },
            // hash: true,
            // cache: true,
        }),
        new ExtractTextPlugin({
            filename: "static/[name].[contenthash:7].css",
            allChunks: true,
        }),
        new CleanPlugin('dist', {
            root: resolve([]),
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: { // 删除打包后的注释
                comments: false
            },
            sourceMap: false,
            parallel: true,
        }),
        new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
          minChunks: function (module) {
            // any required modules inside node_modules are extracted to vendor
            return (
              module.resource &&
              /\.js$/.test(module.resource) &&
              module.resource.indexOf(
                path.join(__dirname, '../node_modules')
              ) === 0
            )
          }
        }),
        new webpack.optimize.CommonsChunkPlugin({
          name: 'manifest',
          minChunks: Infinity
        }),
        // keep module.id stable when vender modules does not change
        new webpack.HashedModuleIdsPlugin(),
        // enable scope hoisting
        new webpack.optimize.ModuleConcatenationPlugin(),
        // new BundleAnalyzerPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                exclude: /node_modules/,
                loader: 'babel',
            },
            {
                test: /\.css$/,
                exclude: /(node_modules|bower_components)/,
                use: ExtractTextPlugin.extract({
                    fallback: "style",
                    publicPath: '../',
                    use: [
                        {
                            loader: 'css',
                            options: {
                                minimize: true,
                                sourceMap: false,
                            },
                        },
                        'postcss',
                    ],
                }),
            },
            {
                test: /\.vue$/,
                exclude: /(node_modules|bower_components)/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'vue',
                        options: {
                            loaders: {
                                css: ExtractTextPlugin.extract({
                                    fallback: 'vue-style',
                                    publicPath: '../',
                                    use: [
                                        {
                                            loader: 'css',
                                            options: {
                                                minimize: true,
                                                sourceMap: false,
                                            },
                                        }, 
                                    ],
                                }),
                            },
                        },
                    },
                ],
            },
       ]
    },
    resolveLoader: {
	    moduleExtensions: ['-loader'],
	},
})