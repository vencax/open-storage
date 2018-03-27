/* global describe it */
const chai = require('chai')
// const should = chai.should()

module.exports = function (g) {
  //
  const r = chai.request(g.baseurl)
  const cntr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
  const content = cntr.map(i => {
    return cntr.join('')
  }).join('')

  return describe('upload', () => {
    //
    it('shall upload bare file', () => {
      return r.post('/upload')
      .set('Upload-Length', 100).set('Tus-Resumable', '1.0.0')
      .then(res => {
        res.should.have.status(201)
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const parts = res.header.location.split('/')
            const fileId = parts[parts.length - 1]
            const req = r.patch(`/upload/${fileId}`)
            .set('Tus-Resumable', '1.0.0')
            .set('upload-offset', 0)
            .set('Upload-Length', 100)
            .set('Content-Type', 'application/offset+octet-stream')
            .send(content)
            resolve(req)
          }, 5000)
        })
      })
      .then(res => {
        res.should.have.status(204)
      })
    })
  })
}
