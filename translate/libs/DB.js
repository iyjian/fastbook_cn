const { Sequelize, DataTypes } = require('sequelize')

// Option 2: Passing parameters separately (sqlite)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './../data/db.sqlite'
})

const book = sequelize.define('book', {
  chapterNum: {
    type: DataTypes.STRING,
    allowNull: false
  },
  chapterTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  originRowNum: {
    type: DataTypes.INTEGER
  },
  originParagraph: {
    type: DataTypes.STRING(4000)
  },
  machineTranslate: {
    type: DataTypes.STRING(4000)
  },
  manualTranslate: {
    type: DataTypes.STRING(4000)
  },
  isVerfied: {
    type: DataTypes.BOOLEAN
  },
  verfyDate: {
    type: DataTypes.DATE
  },
  lastSnapshotDate: {
    type: DataTypes.DATE
  },
  lastMachineTranslateDate: {
    type: DataTypes.DATE
  },
  lastManunalTraslateDate: {
    type: DataTypes.DATE
  },
  diff: {
    type: DataTypes.STRING
  }
}, {
  //
})

const models = {
  book
}


let main = async () => {
  await sequelize.sync()
  await book.create({
    chapterTitle: '1',
    chapterNum: 1
  })
}

main()

exports.models = models
