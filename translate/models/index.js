const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, './../data/db.sqlite'),
  logging: false
})

let db = {}

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== -1) && (file !== 'index.js'))
  .forEach((file) => {
    let model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

sequelize.sync()

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
