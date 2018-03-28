/* global describe it before after */
const fs = require('fs')
const path = require('path')
const chai = require('chai')
const chaiHttp = require('chai-http')
const rimraf = require('rimraf')
chai.use(chaiHttp)
const should = chai.should()

process.env.SERVER_SECRET = 'fhdsakjhfkjal'
const rand = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 15)
process.env.DATABASE_URL = rand + 'test.sqlite'
process.env.DATA_FOLDER = path.resolve('./.testuploads')
process.env.NODE_ENV = 'test'
const port = process.env.PORT || 3333
const g = {
  loggedUser: {
    id: 111,
    username: 'gandalf',
    email: 'gandalf@shire.nz'
  },
  loggedUser2: {
    id: 11,
    username: 'saruman',
    email: 'saruman@mordor.cz'
  },
  baseurl: 'http://localhost:' + port
}
// function sendMail (mail) {
//   return new Promise((resolve, reject) => {
//     g.sentemails.push(mail)
//     resolve(mail)
//   })
// }

describe('app', () => {
  //
  before(done => {
    // this.timeout(5000)
    const InitApp = require('../src/app')
    InitApp().then(app => {
      g.app = app
      g.server = g.app.listen(port, (err) => {
        return err ? done(err) : done()
      })
    })
    .catch(done)
  })

  after(done => {
    g.server.close()
    fs.unlinkSync(process.env.DATABASE_URL)
    rimraf(process.env.DATA_FOLDER, () => {
      done()
    })
  })

  it('should exist', (done) => {
    should.exist(g.app)
    return done()
  })

  describe('API', () => {
    //
    // before(() => {
    //   const r = chai.request(g.baseurl)
    //   return r.post('/login').send(g.loggedUser)
    //   .then((res) => {
    //     res.should.have.status(200)
    //     g.token = res.body.token
    //     g.authHeader = 'Bearer ' + g.token
    //     return r.post('/login').send(g.loggedUser2)
    //   })
    //   .then((res) => {
    //     res.should.have.status(200)
    //     g.token2 = res.body.token
    //     g.authHeader2 = 'Bearer ' + g.token2
    //   })
    // })

    const submodules = [
      './upload'
    ]
    submodules.map((i) => {
      const subMod = require(i)
      subMod(g)
    })
  })
})
