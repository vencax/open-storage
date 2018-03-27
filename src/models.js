
module.exports = (models, bookshelf) => {
  //
  models.file = bookshelf.Model.extend({
    tableName: 'proposals',
    feedbacks: function () {
      return this.hasMany(ProposalFeedback, 'proposalid')
    }
  })
}
