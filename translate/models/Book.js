module.exports = (sequelize, DataTypes) => {
  return sequelize.define('book', {
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
      type: DataTypes.STRING(4000),
      comment: '原文字'
    },
    machineTranslate: {
      type: DataTypes.STRING(4000),
      comment: '机器翻译的文字'
    },
    manualTranslate: {
      type: DataTypes.STRING(4000),
      comment: '手工翻译的文字'
    },
    isVerfied: {
      type: DataTypes.BOOLEAN,
      comment: '是否校验'
    },
    verifyDate: {
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
      type: DataTypes.STRING,
      comment: '差异'
    },
    translator: {
      type: DataTypes.STRING,
      comment: '翻译者'
    }
  }, {
    //
  })
}
