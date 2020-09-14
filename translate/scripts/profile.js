const Translate = require('./../libs/Translate')

Translate.stat().then(response => {
  console.log(`章节\t原文单词\t机器翻译字符\t手动翻译字符`)
  for (chapter in response) {
    const {originWords, machineTranslateWords, manualTranslateWords} = response[chapter]
    console.log(`${chapter}\t${originWords}\t${machineTranslateWords}\t${manualTranslateWords}`)
  }
})
