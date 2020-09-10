const fs = require('fs')
const path = require('path')
const moment = require('moment')
const models = require('./../models')
const Translate = require('./../libs/Translate')

const main = async () => {

  const BOOK_PATH = './../../'

  const files = fs.readdirSync(path.join(__dirname, BOOK_PATH))

  for (let file of files) {
    // 找到以ipynb结尾的文件
    const matches = file.match(/(\d+)_(\w+)\.ipynb$/)

    if (matches && matches.length >= 3) {

      const chapterNum = matches[1]
      const chapterTitle = matches[2]

      let content = JSON.parse(fs.readFileSync(path.join(__dirname, `${BOOK_PATH}/${file}`)))
      
      let row = 1

      for (let cell of content.cells) {
        // 重置变量
        let toBeTranslate

        if (cell.cell_type === 'markdown') {
          for (let paragraph of cell.source) {
            paragraph = paragraph.trim()
            if (paragraph) {

              if (/[\u4e00-\u9fa5]/.test(paragraph)) {
                // 看到中文行就表示翻译过了，那就不翻译了
                toBeTranslate = undefined
              } else {
                // 如果有需要翻译的行，则翻译
                if (toBeTranslate) {
                  const result = await Translate.ali_trans(toBeTranslate)
                  console.log(`原文：${toBeTranslate}`)
                  console.log(`翻译内容：${result}`)
                  exit()
                }
                toBeTranslate = paragraph
              }
            } else {
              // 
            }
          }
        }
        row++
      }
    }
  }

}

main()

                    // await models.book.update({
                    //   manualTranslate: paragraph
                    // }, {
                    //   where: {
                    //     originParagraph: lastOriginParagraph
                    //   }
                    // })
