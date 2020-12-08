const models = require('../models')

const main = async () => {
  const book = await models.book.findAll()
  for (row of book) {
    if (row.originParagraph !== row.originParagraph.trim()) {
      console.log(row.originParagraph)
      row.update({
        originParagraph: row.originParagraph.trim()
      })
    }
  }
}

main()
