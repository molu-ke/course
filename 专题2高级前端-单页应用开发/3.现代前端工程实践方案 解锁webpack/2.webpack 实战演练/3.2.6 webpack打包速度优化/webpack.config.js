const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const extractTextCss = require('extract-text-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
    // 当为生产环境时，压缩和tree-shaking自动开启
    mode:"production",
    entry:{
      app:'./src/app.js'
    },
    output:{
      path:__dirname+'/dist',
      // 通过修改hash为chunkhash，保证文件发生改变时，只修改变文件的hash值  利用浏览器的长缓存
      // 缺点：当模块引用发生改变时，hash也会发生改变
      filename:'./[name].[chunkhash].js',
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
          vendor:{
            test:/[\\/]node_modules[\\/]/,
            name:'vendor',
            priority:-10
          }
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
                loader:'css-loader',
                // include:['src']  排除对什么文件不处理
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
      // new webpack.NamedChunksPlugin(),
      // new webpack.NamedModulesPlugin(),
      new extractTextCss({
        filename:'[name].min.css'
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html',
        vendorPath:'../src/dll/vendor.js',
        chunks:['app']
      }),
      new CleanWebpackPlugin(),
      // new webpack.DllReferencePlugin({
      //   manifest:require('./src/dll/vendor.json')
      // })
      // new BundleAnalyzerPlugin()
    ]

}