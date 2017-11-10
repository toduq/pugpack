const path = require('path')
const globule = require('globule')
const _ = require('lodash')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const srcDir = path.join(__dirname, 'src')
const destDir = path.join(__dirname, 'public')

const jsFiles = _(globule.find(['**/*.js', '!**/_*.js'], {cwd: srcDir}))
  .map((filename) => [filename.replace(/\.js$/, ''), path.join(srcDir, filename)])
  .fromPairs()
  .value()
const sassFiles = _(globule.find(['**/*.sass', '!**/_*.sass'], {cwd: srcDir}))
  .map((filename) => [filename.replace(/\.sass$/, ''), path.join(srcDir, filename)])
  .fromPairs()
  .value()
const pugFiles = _(globule.find(['**/*.pug', '!**/_*.pug'], {cwd: srcDir}))
  .map((filename) => [filename.replace(/\.pug$/, ''), path.join(srcDir, filename)])
  .fromPairs()
  .value()

const releaseBuild = false

module.exports = [
  {
    context: srcDir,
    entry: jsFiles,
    output: {
      filename: '[name].js',
      path: destDir
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015']
          }
        }
      ]
    }
  },
  {
    context: srcDir,
    entry: sassFiles,
    output: {
      filename: '[name].css',
      path: destDir
    },
    module: {
      rules: [
        {
          test: /\.sass$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'sass-loader']
          })
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin('[name].css')
    ]
  },
  {
    context: srcDir,
    entry: pugFiles,
    output: {
      filename: '[name].html',
      path: destDir
    },
    module: {
      rules: [
        {
          test: /\.pug$/,
          loader: 'pug-loader',
          options: {
            pretty: !releaseBuild
          }
        }
      ]
    },
    plugins: _.map(Object.values(pugFiles), (filename) => {
      return new HtmlWebpackPlugin({template: filename, inject: false})
    })
  }
]
