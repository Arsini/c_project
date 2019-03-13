const px2rem = {
    rootValue: 75,
    exclude: /(node_modules|bower_components)/,
}

module.exports = {
    plugins: [
        require('precss'),
        require('postcss-cssnext'),
        require('postcss-import'),
        require('postcss-plugin-px2rem')(px2rem),
    ]
}