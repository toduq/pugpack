const path = require('path')
const globule = require('globule')
const _ = require('lodash')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const srcDir = path.resolve('./src')
const destDir = path.resolve('./dest')

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
    },
    plugins: [
      new CopyWebpackPlugin([
        {from: {glob: '**/*', dot: true}}
      ], {
        ignore: [
          '*.js', '*.sass', '*.pug'
        ]
      })
    ]
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
          use: ExtractTextPlugin.extract([
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: (loader) => [
                  require('autoprefixer')()
                ]
              }
            },
            'sass-loader'
          ])
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
            'save-front-matter-vars-loader',
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
        'save-front-matter-vars-loader': path.join(__dirname, 'lib/save_front_matter_vars_loader.js'),
        'apply-pug-loader': path.join(__dirname, 'lib/apply_pug_loader.js')
      }
    }
  }
]
