const CONSTS = require('./consts')

module.exports = (models, bookshelf) => {
  //
  models.file = bookshelf.Model.extend({
    tableName: CONSTS.TABLENAMES.FILES
  })
}
