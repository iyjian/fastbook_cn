

const Core = require('@alicloud/pop-core')
const conf = require('./../conf')
const models = require('./../models')
const logger = require('./Logger').getLogger('api')

const client = new Core({
  accessKeyId: conf.ali.accessKeyId,
  accessKeySecret: conf.ali.accessKeySecret,
  endpoint: 'https://mt.cn-hangzhou.aliyuncs.com',
  apiVersion: '2018-10-12'
})


const translated = async originParagraph => {
  const row = await models.book.findOne({
    where: {
      originParagraph
    }
  })
  if (row) {
    return row.machineTranslate  
  } else {
    return false
  }
}

exports.stat = async () => {
  const rows = await models.book.findAll()
  // let originWords = 0, machineTranslateWords= 0, manualTranslateWords = 0
  const stat = {

  }
  for (let row of rows) {
    const {originParagraph, machineTranslate, manualTranslate, chapterTitle} = row
    if (!(chapterTitle in stat)) {
      stat[chapterTitle] = {
        originWords: 0,
        machineTranslateWords: 0,
        manualTranslateWords: 0
      }
    }
    stat[chapterTitle].originWords += originParagraph.split(/\s+/).map(o => o.replace(/[^\w]/g, '')).filter(o => o).length
    if (machineTranslate) stat[chapterTitle].machineTranslateWords += machineTranslate.replace(/`~!@#$%\^&\*\(\)_\+=-\\;'":\/\.\,<>\?/g, '').length
    if (manualTranslate) stat[chapterTitle].manualTranslateWords += manualTranslate.length
  }
  return stat
}

exports.ali_trans = async text => {

  const alreadTranslated = await translated(text)

  if (alreadTranslated) {
    return alreadTranslated
  }

  const params = {
    "RegionId": "cn-hangzhou",
    "FormatType": "text",
    "SourceLanguage": "en",
    "TargetLanguage": "zh",
    "SourceText": text,
    "Scene": "general"
  }

  const requestOption = {
    method: 'POST'
  };
  const response = await client.request('TranslateGeneral', params, requestOption)

  if (response.Code !== '200') {
    logger.error(`translateError - ali - ${JSON.stringify(response)}`)
    return ''
  } else {
    logger.trace(`translateSuccess - origin: ${text} translated: ${response.Data.Translated}`)
    await models.book.update({
      machineTranslate: response.Data.Translated
    }, {
      where: {
        originParagraph: text
      }
    })
    return response.Data.Translated
  }
}
