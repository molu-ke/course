const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
    mode:'development',
    entry:'./index.js',
    output:{
        filename:'bundle.js',
        path:path.resolve(__dirname,'dist')
    },
    module:{
        rules:[
            {
                test:/\.vue$/,
                loader:'vue-loader'
            },
            {
                test:/\.js$/,
                loader:'babel-loader'
            }
        ]
    },
    plugins:[
        new VueLoaderPlugin()
    ]
}