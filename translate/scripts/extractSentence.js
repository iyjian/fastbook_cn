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
        // 重置变量
        let lastOriginParagraph, lastTranslatedParagraph

        if (cell.cell_type === 'markdown') {
          for (let paragraph of cell.source) {
            paragraph = paragraph.trim()
            if (paragraph) {

              if (/[\u4e00-\u9fa5]/.test(paragraph)) {
                if (!lastOriginParagraph) {
                  console.log('错误！此行翻译未对应原文')
                  console.log(`章节：${chapterTitle} 章节序号：${chapterNum} 单元格：${row} 翻译内容：${paragraph}`)
                } else {
                  if (/^机器翻译:/.test(paragraph)) {
                    // 
                  } else {
                    // 如果存在非机器翻译的翻译行，则把翻译行更新到原文行
                    await models.book.update({
                      manualTranslate: paragraph
                    }, {
                      where: {
                        originParagraph: lastOriginParagraph
                      }
                    })                    
                  }
                }
              } else {
                // 原文行
                const isExist = await models.book.findOne({
                  where: {
                    originParagraph: paragraph
                  }
                })
                if (isExist) {
                  // console.log('原文已经记录过！')
                } else {
                  await models.book.create({
                    chapterNum,
                    chapterTitle,
                    originRowNum: row,
                    originParagraph: paragraph,
                    lastSnapshotDate: moment().format('YYYY-MM-DD HH:mm:ss')
                  })
                }
                lastOriginParagraph = paragraph
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
