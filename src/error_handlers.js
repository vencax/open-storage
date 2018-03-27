
module.exports = (app) => {
  //
  function logError (err, req, res, next) {
    console.log('-----------------------------------------')
    console.error(err)
    console.log('-----------------------------------------')
    next(err)
  }

  function authError (err, req, res, next) {
    if (err.name && err.name === 'UnauthorizedError') {
      return res.status(401).json(err)
    }
    next(err)
  }

  function commonError (err, req, res, next) {
    res.status(err.status || 400).json(err)
    next(err)
  }

  const handlers = [authError, commonError]
  process.env.ALLOWED_ORIGIN && handlers.push(logError)

  app.use(handlers)
}
