const path = require('path')
const fs = require('fs')
const childProcess = require('child_process')
const sane = require('sane')

const binDir = childProcess.spawnSync('npm', ['bin']).stdout.toString().trim()
const webpackPath = path.join(binDir, 'webpack')
const reloadPath = path.join(binDir, 'reload')

const configPath = path.join(__dirname, 'webpack.config.js')

try {
  const userConfigPath = path.resolve('pugpack.config.js')
  fs.accessSync(userConfigPath)
  global.pugpack = require(userConfigPath)
} catch (err) {
  if (err.code !== 'ENOENT') throw err
}
const opts = global.pugpack || {}

opts.srcDir = path.resolve(opts.srcDir || 'src')
opts.destDir = path.resolve(opts.destDir || 'dest')

var process
function restartWebpack () {
  if (process) process.kill()
  process = childProcess.spawn(webpackPath, ['--config', configPath, '--watch'], {stdio: 'inherit'})
}

const watcher = sane(opts.srcDir, {glob: '**/*.@(js|sass|pug)'})
watcher.on('ready', () => {
  restartWebpack()
  childProcess.spawn(reloadPath, ['-b', '-d', opts.destDir], {stdio: 'inherit'})
})
watcher.on('add', restartWebpack)
watcher.on('delete', restartWebpack)
