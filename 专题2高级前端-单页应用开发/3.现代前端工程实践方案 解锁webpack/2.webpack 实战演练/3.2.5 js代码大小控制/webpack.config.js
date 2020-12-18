const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const extractTextCss = require('extract-text-webpack-plugin')
const path = require('path')

module.exports = {
    // 当为生产环境时，压缩和tree-shaking自动开启
    mode:"production",
    entry:{
      app:'./src/app.js'
    },
    output:{
      path:__dirname+'/dist',
      filename:'./[name].bundle.[hash:4].js',
    },
    // webpac4所有优化相关的操作（代码分割、压缩...）都在optimization
    optimization:{
      // minimize:true,
      splitChunks:{
        name:true,
        // initial所有的入口、模块都进行提取
        // async 对异步模块进行提取
        // all   对所有的入口公共模块都进行提取
        chunks:'initial',
        minSize:0,
        automaticNameDelimiter:".",
        // 指定分割 -- 单抽打包模块
        cacheGroups:{
          // vendor:{
          //   test:/[\\/]node_modules[\\/]/,
          //   name:'vendor',
          //   priority:-10
          // }
          // jquery:{
          //   test:/jquery/,
          //   name:'jquery',
          //   priority:-10
          // }
        }
      },
      // 拆分webpack运行代码
      runtimeChunk:{
        name:'runtime'
      }
    },
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
              },
            ]
          })
        },
        {
          test:/\.(png|jpg|jpeg|gif)$/,
          use:[
            {
              // loader:'file-loader',
              loader:'url-loader',
              options:{
                name:'[name].[hash:4].[ext]',
                outputPath:'assets/img',
                publicPath:"assets/img",
                // 5kb
                limit:'5000', // 图片<5kb 转base64
              }
              
            },
          ]
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
        chunks:['app']
      }),
      new CleanWebpackPlugin()
    ]

}