require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 3000
const InitApp = require('./src/app')
const UseErrorHandlers = require('./src/error_handlers')

InitApp().then(app => {
  const opts = {
    maxAge: 86400,
    origin: process.env.ALLOWED_ORIGIN || '*',
    methods: ['DELETE', 'PUT', 'POST', 'OPTIONS', 'GET']
  }
  app.use(cors(opts))
  UseErrorHandlers(app)

  app.listen(port, () => {
    console.log('gandalf do magic on ' + port)
  })
})
.catch(err => console.log(err))
