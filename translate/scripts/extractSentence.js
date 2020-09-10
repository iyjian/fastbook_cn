const fs = require('fs')
const path = require('path')
const moment = require('moment')
const models = require('./../models')


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
        if (cell.cell_type === 'markdown') {
          for (let paragraph of cell.source) {
            paragraph = paragraph.trim()
            if (paragraph) {
              console.log('---')
              console.log(paragraph)
              console.log('---')
              if (/[\u4e00-\u9fa5]/.test(paragraph)) {
                // 如果存在翻译行，则把翻译行更新到原文行

              } else {
                // 原文行

                lastOriginParagraph = paragraph
              }
              // models.book.create({
              //   chapterNum,
              //   chapterTitle,
              //   originRowNum: row,
              //   originParagraph: paragraph,
              //   lastSnapshotDate: moment().format('YYYY-MM-DD HH:mm:ss')
              // })
            }
          }
        }
        row++
      }
    }
  }

}

main()
