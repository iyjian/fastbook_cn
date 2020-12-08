const Translate = require('../libs/Translate')
const Table = require('cli-table')

const table = new Table({
  head: ['章节', '原文单词数', '机器翻译字符', '手动翻译字符'],
  colWidths: [25, 20, 20, 20],
  colAligns: ["left", "left", "left", "left"]
});

Translate.stat().then(response => {
  for (chapter in response) {
    const {originWords, machineTranslateWords, manualTranslateWords} = response[chapter]
    // console.log(`${chapter}\t${originWords}\t${machineTranslateWords}\t${manualTranslateWords}`)
    table.push([chapter, originWords, machineTranslateWords, manualTranslateWords])
  }
  console.log(table.toString())
})
