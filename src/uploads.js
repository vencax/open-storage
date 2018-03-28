const path = require('path')
// const fs = require('fs')
const mv = require('mv')
const express = require('express')
const TUSServer = require('tus-node-server')
const db = require('./db')

const server = new TUSServer.Server()

const UPLOAD_FOLDER = process.env.UPLOADING_FOLDER || path.resolve('./.incompletes')
server.datastore = new TUSServer.FileStore({
  directory: UPLOAD_FOLDER,
  path: '/tus'
})

const DATA_FOLDER = process.env.DATA_FOLDER || path.resolve('./.data')

function moveFromUploadFolder (src, fileObj) {
  return new Promise((resolve, reject) => {
    const srcFile = path.join(UPLOAD_FOLDER, src)
    const destFile = path.join(DATA_FOLDER, fileObj.filename)
    mv(srcFile, destFile, {mkdirp: true}, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

module.exports = () => {
  //
  server.on(TUSServer.EVENTS.EVENT_ENDPOINT_CREATED, (evt) => {
    db.knex('incompletes').insert({
      uid: evt.File.id,
      params: JSON.stringify(evt.req.query)
    }).then(res => {})
  })

  server.on(TUSServer.EVENTS.EVENT_UPLOAD_COMPLETE, (evt) => {
    let data = null
    const incomplete = db.knex('incompletes').where('uid', evt.file.id)
    incomplete.first()
    .then(found => {
      const params = JSON.parse(found.params)
      data = Object.assign({
        filename: found.uid,
        tags: 'untagged',
        created: new Date()
      }, params)
      return db.knex('files').insert(data)
    })
    .then(affected => {
      return moveFromUploadFolder(evt.file.id, data)
    })
    .then(created => {
      return incomplete.delete()
    })
  })

  const uploadApp = express()
  uploadApp.all('*', server.handle.bind(server))
  return uploadApp
}
