/* global describe it */
const chai = require('chai')
const assert = chai.assert
const sleep = require('sleep-promise')
const path = require('path')
const fs = require('fs')

module.exports = function (g) {
  //
  const r = chai.request(g.baseurl)
  const cntr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
  const content = cntr.map(i => {
    return cntr.join('')
  }).join('')
  const filename = 'pokus.txt'

  return describe('upload', () => {
    //
    it('shall upload bare file', () => {
      let fileId = null
      return r.post(`/upload?filename=${filename}`)
      .set('Upload-Length', 100).set('Tus-Resumable', '1.0.0')
      .then(res => {
        res.should.have.status(201)
        const parts = res.header.location.split('/')
        fileId = parts[parts.length - 1]
        return sleep(500)
      })
      .then(() => {
        return r.patch(`/upload/tus/${fileId}`)
        .set('Tus-Resumable', '1.0.0')
        .set('upload-offset', 0)
        .set('Upload-Length', 100)
        .set('Content-Type', 'application/offset+octet-stream')
        .send(content)
      })
      .then(res => {
        res.should.have.status(204)
        return sleep(500)
      })
      .then(() => {
        const createdFile = path.join(process.env.DATA_FOLDER, filename)
        const uploadedFileExists = fs.existsSync(createdFile)
        assert.isTrue(uploadedFileExists)
      })
    })
  })
}
