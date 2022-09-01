const jwt = require('jsonwebtoken')
const httpErrors = require('http-errors')

/**
 * 
 * @param {'headers'} value
 */
const tokenValidator = () => {
    return (req, res, next) => {
      
      const {headers: {authorization}} = req
      
      if(!authorization)
        throw new httpErrors.Unauthorized('Not Allowed')

      const [token_type, token] = authorization.split(' ')

      if(token_type !== 'Bearer')
        throw new httpErrors.Unauthorized('Not Allowed')

      const payload = jwt.verify(token, process.env.SECRET)

      console.log(payload)

      next()
    }
  }
  
  module.exports = tokenValidator
  