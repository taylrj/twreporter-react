import ExpressServer from './express/server'
import Loadable from 'react-loadable'
import config from '../config'
import path from 'path'
import globalEnv from './global-env'
import loggerFactory from './logger'

const logger = loggerFactory.getLogger()

/**
 *  Loads file asynchrously and repeatedly if failing.
 *
 *  @param {string} filepath
 *  @param {number} [retry=0]
 *  return {Promise} resolves with file required, rejects with retrying too many times
 */
function readWebpackGeneratedFiles(filepath, retry=0) {
  const maxRetry = 10
  return new Promise((resolve, reject) => {
    try {
      const file = require(filepath)
      resolve(file)
    } catch(err) {
      if (retry < maxRetry) {
        return setTimeout(() => {
          readWebpackGeneratedFiles(filepath, retry + 1).then(resolve).catch(reject)
        }, 5000) // rest 5 secs
      }
      return reject('can not load ' + filepath)
    }
    logger.info('load ' + filepath)
  })
}

const host = config.host || 'localhost'
const port = config.port || 3000


/**
 *  Loads webpack generated files, which are
 *  `webpack-assets.json`
 *  `react-loadable.json`
 *
 *  `webpack-assets.json` is generated by `BundleListPlugin` defined in `./webpack.config.js`.
 *  `react-loadable.json` is generated by `ReactLoadablePlugin` of `react-loadable/webpack`.
 *  These two files are used for server side rendering.
 */
Promise.all([
  readWebpackGeneratedFiles(path.resolve(__dirname + '/../webpack-assets.json')),
  readWebpackGeneratedFiles(path.resolve(__dirname + '/../react-loadable.json'))
]).then((files) => {
  const server = new ExpressServer()
  const options = {
    nodeEnv: config.nodeEnv,
    releaseBranch: config.releaseBranch,
    cookieSecret: config.cookieSecret
  }
  server.setup(files[0], files[1], options)
    .then(() => {
      if (globalEnv.isDevelopment) {
        server.run(host, port)
      } else {
        return Loadable.preloadAll().then(() => {
          server.run(host, port)
        })
      }
    })
}).catch(logger.error)
