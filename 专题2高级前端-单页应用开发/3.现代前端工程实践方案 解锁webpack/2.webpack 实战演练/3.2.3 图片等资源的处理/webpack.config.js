const HtmlWebpackPlugin = require('html-webpack-plugin')
const extractTextCss = require('extract-text-webpack-plugin')
const webpackSpriteSmit = require('webpack-spritesmith')
const path = require('path')

module.exports = {
    mode:"development",
    entry:{
      app:'./src/app.js',
    },
    output:{
      path:__dirname+'/dist',
      filename:'./[name].bundle.js'
    },
    // resolve:{
    //   alias:{
    //     a2:"./js/app2.js"
    //   }
    // },
    module:{
      rules:[
        {
          test:/\.css$/,
          use:extractTextCss.extract({
            fallback:{
              loader:'style-loader'
            },
            use:[
              {
                loader:'css-loader'
              }
            ]
          })
        },
        {
          test:/\.(png|jpg|jpeg|gif)$/,
          use:{
            loader:'file-loader',
            options:{
              name:'[name].[hash:4].[ext]',
              outputPath:'assets/img'
            }
            
          }
        }
      ]
    },
    plugins:[
      new extractTextCss({
        filename:'[name].min.css'
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