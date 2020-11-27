const webpack = require('webpack')
const dev = require('./webpack.dev.js')
const pro = require('./webpack.pro.js')
const ExtractTextCss = require('extract-text-webpack-plugin')
const { merge } = require('webpack-merge');


module.exports = env => {

  // 根据是生产环境还是开发环境，决定是否启用雪碧图功能
  let postPlugins = [ require('autoprefixer')() ]
  let spriteChart = [ require('postcss-sprites')({ spritePath:'dist/sprite',retina:true})]
  postPlugins.concat( env === 'production'?spriteChart:[])
                 
  const common = {
    mode:'development',
    entry: './app.js',
    output: {
      filename: 'bundle.js'
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
                    plugins:postPlugins
                  }
                }
              }
            ]
          })
        }
      ]
    },
    plugins: [
      new ExtractTextCss({
        filename: env === 'production' ? 'app.bundle.css' : 'app.dev.css'
      }),
    ]
  }

  return merge(common, env === 'production' ? pro : dev)
}