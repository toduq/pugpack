const path = require('path')
const spawn = require('child_process').spawn
const sane = require('sane')
const liveServer = require('live-server')

var process
function startWebpack () {
  if (process) process.kill()
  const webpackCommand = path.join(__dirname, 'node_modules/.bin/webpack')
  process = spawn(webpackCommand, ['--watch'], {stdio: 'inherit'})
}

const watcher = sane('src', {glob: '**/*.@(js|sass|pug)'})
watcher.on('ready', () => {
  startWebpack()
  liveServer.start({
    root: 'dest'
  })
})
watcher.on('add', startWebpack)
watcher.on('delete', startWebpack)
