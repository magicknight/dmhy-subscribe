const Aria2 = require('aria2')
const { URL } = require('url')
const log = require('debug')('dmhy:downloaders:aria2')
const { console, l10n } = require('../utils')

const args = process.argv.slice(2)
const thread = JSON.parse(args[0])
const { jsonrpc, destination } = JSON.parse(args[1])

log(args)

const u = new URL(jsonrpc)
const verify = [
  [!u.hostname, 'You must provide hostname'],
  [u.username && u.username !== 'token', 'Only secret is supported!'],
  [u.username && !u.password, 'You must provide secret']
]
verify.forEach(([cond, msg]) => {
  if (cond) {
    console.error(msg)
    process.exit(1)
  }
})
const client = new Aria2({
  host: u.hostname,
  port: u.port || 6800,
  secure: false,
  secret: u.password,
  path: u.pathname
})
client.onerror = err => {
  console.error('aria2 connect error: %o', err)
}
const opts = {}
if (destination) {
  opts.dir = destination
}
client
  .open()
  .then(() => client.addUri([thread.link], opts))
  .then(() => {
    console.success(l10n('CLIENT_DL_SUCCESS_MSG', { title: thread.title }))
    client.close()
  })
  .catch(() => {
    console.error(l10n('CLIENT_DL_FAILED_MSG', { title: thread.title }))
    client.close()
  })