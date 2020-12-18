const HtmlWebpackPlugin = require('html-webpack-plugin')
const myplugin = require('./myplugin')

module.exports = {
    mode:"development",
    entry: './src/app.js',

    module:{
      rules:[
        {
          test:/\.wy$/,
          use:{
            loader:'./wy-loader'
          }
        }
      ]
    },
    plugins:[
      new myplugin({
        
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html',
        minify: {
          collapseWhitespace: false
        },
        inject: true
      })
    ]

}