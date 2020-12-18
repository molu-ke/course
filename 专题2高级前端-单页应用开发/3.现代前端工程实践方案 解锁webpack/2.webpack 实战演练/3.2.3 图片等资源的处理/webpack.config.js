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
      filename:'./[name].bundle.js',
      // publicPath:'xxxxx', // 引入文件的路径修改
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
              // 全部图片生成雪碧图  根据原图大小调节background-positions，所以存在定位不准的问题
              // {
              //   loader:'postcss-loader',
              //   options:{
              //     postcssOptions: {
              //       ident: 'postcss',
              //       plugins:[
              //         require('postcss-sprites')({
              //           spirtePath:'./dist/assets/sprite'
              //         })
              //       ]
              //     }
              //   }
              // }
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
            // 图片压缩插件imagemin  imagemin-pngquant   imagemin-mozjpeg  imagemin-gifsicle
            {
              loader:'img-loader',
              options:{
                  // 打包报错了，可能是版本的问题，先压后
                plugins:[
                  // require('imagemin-pngquant')({
                  //   speed: 2 // 1- 11  越大压缩强度越小
                  // }),
                  // require('imagemin-mozjpeg')({
                  //   quality: 80 // 1- 100  越大压缩强度越小
                  // }),
                  // require('imagemin-gifsicle')({
                  //   optimizationLevel:1 // 1  2  3
                  // }),
                ]
              }
            }
          ]
        },
        {
          test:/\.html$/,
          use:{
            loader:'html-loader',
            options:{
              attributes: {
                list: [
                  // 对html的什么标签什么属性进行解释
                  {
                    tag: 'img',
                    attribute: 'src',
                    type: 'src',
                  },
                  {
                    tag: 'video',
                    attribute: 'src',
                    type: 'src',
                  }
                ]
              }
            }
          }
        },
        {
          test:/\.mp4$/,
          use:{
            loader:'url-loader'
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
        title:'图片等资源的处理',
        minify: {
          collapseWhitespace: false
        },
        inject: true
      }),
      new webpackSpriteSmit({
        src:{
          cwd:path.join(__dirname,"src/assets"),
          glob:"*.jpg"
        },
        target:{
          image:path.join(__dirname,"dist/sprites/sprite.png"),
          css:path.join(__dirname,"dist/sprites/sprite.css")
        },
        apoOptions:{
          cssImageRef:'./sprites/sprite.png' // 引用地址
        }
      })
    ]

}