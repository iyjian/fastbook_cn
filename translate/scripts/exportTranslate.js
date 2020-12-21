const models = require('../models')
const fs = require('fs')
const path = require('path')

const output_path = path.join(__dirname, './../translatedOutput')

const main = async () => {
  const output_file = path.join(output_path, 'chapter01.md')
  if (fs.existsSync(output_file)) {
    fs.rmSync(output_file)
  }
  const rows = await models.book.findAll({
    where: {
      chapterNum: '01'
    },
    orderBy: [['originRowNum', 1]]
  })
  for (let row of rows) {
    if (row['manualTranslate']) {
      fs.appendFileSync(output_file, row['manualTranslate'])
    }
  }
}

main()
