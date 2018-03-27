const express = require('express')
const bodyParser = require('body-parser')
// const expressJwt = require('express-jwt')
const Uploads = require('./uploads')
const db = require('./db')

module.exports = (app, sendMail) => db.migrate.latest().then(() => {
  //
  const app = express()

  // JSON body parser for parsing incoming data
  app.use(bodyParser.json())

  // const g = {
  //   authMW: expressJwt({secret: process.env.SERVER_SECRET}),
  //   models: db.models,
  //   startTransaction: db.startTransaction,
  //   getUserGroups: (user) => user.groups || []
  // }

  const uploadApp = Uploads()
  app.use('/upload', uploadApp)

  return app
})
