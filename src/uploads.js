const path = require('path')
const fs = require('fs')
const mv = require('mv')
const express = require('express')
const TUSServer = require('tus-node-server')
const db = require('./db')

const server = new TUSServer.Server()

const UPLOAD_FOLDER = process.env.UPLOADING_FOLDER || '/.incompletes'
server.datastore = new TUSServer.FileStore({
  path: UPLOAD_FOLDER,
  createUrl: (req, File) => {
    const host = `${req.protocol}://${req.headers.host}`
    return `${host}${req.baseUrl || ''}/${File.id}`
  },
  getFileIdFromReq: (req) => {
    const re = new RegExp(`${req.baseUrl || ''}\\/(\\S+)\\/?`)
    const match = (req.originalUrl || req.url).match(re)
    if (!match) { return false }
    return match[1]
  }
})

const DATA_FOLDER = process.env.DATA_FOLDER || '/.data'

module.exports = () => {
  //
  server.on(TUSServer.EVENTS.EVENT_ENDPOINT_CREATED, (evt) => {
    db.knex('incompletes').insert({
      uid: evt.File.id,
      params: JSON.stringify(evt.req.query)
    }).then(res => {})
  })

  server.on(TUSServer.EVENTS.EVENT_UPLOAD_COMPLETE, (evt) => {
    db.knex('incompletes').where('uid', evt.file.id).first()
    .then(found => {
      const params = JSON.parse(found.params)
      const data = Object.assign({
        filename: evt.File.id,
        tags: 'untagged',
        created: new Date()
      }, params)
      return db.knex('files').insert(data)
    })
    .then(created => {
      const src = path.join(UPLOAD_FOLDER, evt.file.id)
      const dest = path.join(DATA_FOLDER, created.filename)
      mv(src, dest, (err) => {
        if (err) throw err
      })
    })
  })

  const uploadApp = express()
  uploadApp.all('*', server.handle.bind(server))
  return uploadApp
}
