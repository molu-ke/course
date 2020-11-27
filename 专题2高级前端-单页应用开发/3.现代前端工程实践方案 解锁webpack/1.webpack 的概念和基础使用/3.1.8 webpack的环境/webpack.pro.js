const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    optimization:{ // 压缩文件
        minimize:false
    },
    plugins:[
        new HtmlWebpackPlugin({
            filename:'index.html',
            template:'./index.html',
            minify:{
                collapseWhitespace:false
            },
            inject:true
        })
    ]
}

