const fs = require('fs')
const path = require('path')
const moment = require('moment')
const models = require('../models')
const Translate = require('../libs/Translate')
const _ = require('lodash')
const logger = require('../libs/Logger').getLogger('api')

const flag = process.argv[2]
const allowRecordNew = process.argv[3]
const allowMachineTranslate = process.argv[4]

const main = async () => {

  const BOOK_PATH = './../../'

  const files = fs.readdirSync(path.join(__dirname, BOOK_PATH))

  for (let file of files) {
    // 找到以ipynb结尾的文件
    const matches = file.match(/(\d+)_(\w+)\.ipynb$/)

    if (matches && matches.length >= 3) {

      const chapterNum = matches[1]
      const chapterTitle = matches[2]

      const filePath = path.join(__dirname, `${BOOK_PATH}/${file}`)

      let content = JSON.parse(fs.readFileSync(filePath))
      
      let row = 1

      for (let cell of content.cells) {
        row++
        // 重置变量
        let lastParagraph, lastParagraphIndex, paragraph = '', translatedRows = 0

        if (cell.cell_type === 'markdown') {

          let cellSourceCopy = _.cloneDeep(cell.source)

          const cellSourceLength = cell.source.length

          for (let idx in cellSourceCopy) {
            idx = parseInt(idx)
            if (cellSourceCopy[idx] === '\n') continue
            if (!cellSourceCopy[idx]) continue

            if (idx + 1 === cellSourceLength || cellSourceCopy[idx + 1] === '\n') {
              // 如果下一行是换行或者说这是最后一行了，则表示这是一个段落的结束，需要开始处理此段落
              paragraph += cellSourceCopy[idx]
            } else {
              // 否则仍然是同一个段落，此时就将此行拼接到现有的段落之上
              paragraph += cellSourceCopy[idx]
              continue
            }
      
            if (/[\u4e00-\u9fa5]/.test(paragraph)) {
              /**
               * TODO: 如何判断是原文段落还是翻译段落，现在是用如果含有中文就算是翻译段落，其实不然，原文中也可能有中文呀
               * 看到中文段落就表示翻译过了，那就不翻译了
               * 但是如果看到*不含【机器翻译】*字样结尾的段落表示此段落是人工翻译的，需要更新到原文段落中。
               */
              if (!/\[机器翻译\]\n{0,}$/.test(paragraph)) {
                if (!lastParagraph) {
                  console.log(`-----------------------翻译没找到原文：${paragraph}-------------------------------------------`)
                }
                const recordParagraph = await models.book.findOne({
                  where: {
                    originParagraph: lastParagraph.trim()
                  }
                })
                if (recordParagraph && recordParagraph.manualTranslate === paragraph) {
                  // 如果翻译过了就不翻译了
                  logger.trace(`old manual translate`)
                } else if (lastParagraph) {
                  // logger.debug(`----------\nnewManualTranslate \norigin: ${lastParagraph} \ntranslate: ${paragraph}\n----------`)
                  console.log(`---------------------------检测到人工翻译${chapterNum}.${chapterTitle}(${row})------------------`)
                  console.log(`原文: ${lastParagraph}\n`)
                  console.log(`译文: ${paragraph}`)
                  console.log('----------------------------------------------------------------------\n\n')                  
                  if (flag) {
                    await models.book.update({
                      manualTranslate: paragraph
                    }, {
                      where: {
                        originParagraph: lastParagraph.trim()
                      }
                    })
                  }               
                }
              }
              paragraph = ''
              lastParagraph = undefined
            } else {
              // 如果不是中文段落，那就是原文，先记录下来再说哦
              const isExist = await models.book.findOne({
                where: {
                  originParagraph: paragraph.trim()
                }
              })
              if (!isExist) {
                console.log(`---------------------------检测到新段落${chapterNum}.${chapterTitle}(${row})------------------`)
                console.log(`译文: ${paragraph}`)
                console.log('----------------------------------------------------------------------\n\n')
                if (flag && allowRecordNew) {
                  await models.book.create({
                    chapterNum,
                    chapterTitle,
                    originRowNum: row,
                    originParagraph: paragraph.trim(),
                    lastSnapshotDate: moment().format('YYYY-MM-DD HH:mm:ss')
                  })
                }
              }
              // 如果本段落需要翻译，则翻译，并记录数据库，并更新到原文段落里
              /**
               * 机器翻译这个标识符最好放在后面，因为放在前面会影响markdown的格式，
               * 比如 # This is a title，试想下放在前面markdown格式就错乱了。
               */
              // 如果上一行需要翻译，则翻译之
              if (lastParagraph) {
                const result = await Translate.ali_trans(lastParagraph)
                cell.source.splice(lastParagraphIndex + 1 + translatedRows, 0, '\n', '\n', result.replace(/(\n{0,})$/,'[机器翻译]$1'))
                translatedRows += 3
              }
              // 如果是最后一行，也翻译之
              if (idx === cellSourceLength - 1) {
                const result = await Translate.ali_trans(paragraph)
                cell.source.splice(idx + 1 + translatedRows, 0, '\n', '\n', result.replace(/(\n{0,})$/,'[机器翻译]$1'))
                translatedRows += 3
              }
              lastParagraph = paragraph
              lastParagraphIndex = idx
              paragraph = ''
            }

          }

        }

      }
      logger.debug(`the translation of ${chapterNum} - ${chapterTitle} is completed!`)
      if (flag && allowMachineTranslate) {
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2))        
      }
      // process.exit(0)
    }
  }

}

// const flag = process.argv[2]
// const allowRecordNew = process.argv[3]
// const allowMachineTranslate = process.argv[4]
// console.log(flag, '------')
// process.exit(0)
main()
