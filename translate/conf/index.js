require('dotenv').config({ path: require('path').join(__dirname, '/../.env')})

module.exports = {
  ali: {
    accessKeyId: process.env.ALI_accessKeyId,
    accessKeySecret: process.env.ALI_accessKeySecret
  },
  logLevel: process.env.LOG_LEVEL
}
