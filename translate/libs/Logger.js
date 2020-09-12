const conf = require('./../conf')
const log4js = require('log4js')

options = {
  pm2: true,
  // 每个appender就是一个log输出
  appenders: {
    console: {
      type: 'console'
    },
    logFile: {
      type: 'dateFile',
      filename: __dirname + '/../logs/tradeServer.log'
    },
    errorFile: {
      type: 'dateFile',
      filename: __dirname + '/../logs/errors.log'
    },
    errors: {
      type: 'logLevelFilter',
      appender: 'errorFile',
      level: 'ERROR'
    },
    consoleError: {
      type: 'logLevelFilter',
      appender: 'console',
      level: 'ERROR'
    }
  },
  // 定义上面的log输出的集合，然后取一个名字，用在getLogger中
  categories: {
    default: {
      appenders: [
        'console'
      ],
      level: 'all'
    },
    api: {
      appenders: [
        'errors', 'consoleError', 'console', 'logFile'
      ],
      level: conf.logLevel
    }
  }
}
// }

log4js.configure(options)

module.exports = log4js
