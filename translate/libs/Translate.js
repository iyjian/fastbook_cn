

const Core = require('@alicloud/pop-core')
const conf = require('./../conf')

const client = new Core({
  accessKeyId: conf.ali.accessKeyId,
  accessKeySecret: conf.ali.accessKeySecret,
  endpoint: 'https://mt.cn-hangzhou.aliyuncs.com',
  apiVersion: '2018-10-12'
})

exports.ali_trans = async text => {
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
    console.log(JSON.stringify(response))
    return ""
  } else {
    return response.Data.Translated
  }
}


// Imports the Google Cloud client library
// const {Translate} = require('@google-cloud/translate').v2
 

// const projectId = 'fastai-translate'

// // Instantiates a client
// const translate = new Translate({projectId})
 
// async function quickStart() {
//   // The text to translate
//   const text = 'Hello, world!';
 
//   // The target language
//   const target = 'ru';
 
//   // Translates some text into Russian
//   const [translation] = await translate.translate(text, target);
//   console.log(`Text: ${text}`);
//   console.log(`Translation: ${translation}`);
// }
 
// quickStart();
