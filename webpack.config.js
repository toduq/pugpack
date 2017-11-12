const path = require('path')
const globule = require('globule')
const _ = require('lodash')

const ExtractTextPlugin = require('extract-text-webpack-plugin')

const srcDir = path.join(__dirname, 'src')
const destDir = path.join(__dirname, 'public')

const files = _(['js', 'sass', 'pug'])
  .map((extname) => {
    return [
      extname,
      _(globule.find([`**/*.${extname}`, `!**/_*.${extname}`], {cwd: srcDir}))
        .map((filename) => [filename.replace(new RegExp(`.${extname}$`, 'i'), ''), path.join(srcDir, filename)])
        .fromPairs()
        .value()
    ]
  })
  .fromPairs()
  .value()

module.exports = [
  {
    context: srcDir,
    entry: files.js,
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
    entry: files.sass,
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
    entry: files.pug,
    output: {
      filename: '[name].html',
      path: destDir
    },
    module: {
      rules: [
        {
          test: /\.pug$/,
          use: ExtractTextPlugin.extract([
            'apply-pug-loader',
            'pug-loader',
            'after-front-matter-loader',
            'front-matter-loader'
          ])
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin('[name].html')
    ],
    resolveLoader: {
      alias: {
        'after-front-matter-loader': path.join(__dirname, 'lib/after_front_matter_loader.js'),
        'apply-pug-loader': path.join(__dirname, 'lib/apply_pug_loader.js')
      }
    }
  }
]
