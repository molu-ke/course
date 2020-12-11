const webpack = require('webpack')
const ExtractTextCss = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = {
  mode: 'development',
  entry: {
    app: './src/app.js'
  },
  output: {
    path: __dirname + "/dist",
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      // js处理
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env']
            ]
          }
        }
      },
      // css处理
      {
        test: /\.css$/,
        use: ExtractTextCss.extract({
          fallback: { loader: 'style-loader', options: {} },
          use: [
            { loader: 'css-loader' },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  ident: 'postcss',
                  plugins: [
                    require('autoprefixer')()
                  ]
                }
              }
            }
          ]
        })
      }
    ]
  },

  devtool:'eval-source-map',

  devServer: {
    port: 9001, // 指定端口号
    inline:true, // 服务的开启模式
    overlay: true, // 出现编译器错误或警告时，在浏览器中显示全屏覆盖
    // historyApiFallback:true,
    historyApiFallback:{
      rewrites:[
        {
          from:/^\/([ -~]+)/,
          to:function(context){
            console.log('-----------',context[1])
            return './'+ context.mathch[1] + '.html'
          }
        }
      ]
    },
    proxy:{
      "/":{
        target:'https://mooc.study.163.com/',
        changeOrigin:true
      }
    },
    hot: true, // 启用热更新
    hotOnly: true, // 启用热更新
  },

  plugins: [
    // 在开发环境下该插件跟热更新有冲突，因此先禁用
    new ExtractTextCss({
      filename: 'app.bundle.css',
      disable:true
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
