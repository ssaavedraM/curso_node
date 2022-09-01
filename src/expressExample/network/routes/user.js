const { Router } = require('express')
const jwt = require('jsonwebtoken')
const httpErrors = require('http-errors')

const {
  user: { storeUserSchema, updateUserSchema, userIDSchema, loginUserSchema }
} = require('../../schemas')
const { validatorCompiler, tokenValidator } = require('./utils')
const response = require('./response')
const { UserService } = require('../../services')

const UserRouter = Router()

UserRouter.route('/user')
  .get(tokenValidator(),async (req, res, next) => {

    try {
      response({
        error: false,
        message: await new UserService().getAllUsers(),
        res,
        status: 200
      })
    } catch (error) {
      next(error)
    }
  })
  .post(tokenValidator(),validatorCompiler(storeUserSchema, 'body'), async (req, res, next) => {
    try {
      const {
        body: { name, lastName, email, password, role }
      } = req

      response({
        error: false,
        message: await new UserService({
          name,
          lastName,
          email,
          password,
          role

        }).saveUser(),
        res,
        status: 201
      })
    } catch (error) {
      next(error)
    }
  })

UserRouter.route('/user/signup').post(
  validatorCompiler(loginUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const {
        body: { email, password }
      } = req

      response({
        error: false,
        message: await new UserService({ email, password }).login(),
        res,
        status: 201
      })
    } catch (error) {
      next(error)
    }
  }
)

UserRouter.route('/user/login').post(
  validatorCompiler(loginUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const {
        body: { email, password }
      } = req

      const payload = { email, password}
      const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: '5min'
      })

      console.log('token', token)
      response({
        error: false,
        message: await new UserService({ email, password }).login(),
        res,
        status: 201
      })
    } catch (error) {
      next(error)
    }
  }
)

UserRouter.route('/user/:id')
  .get(tokenValidator(),validatorCompiler(userIDSchema, 'params'), async (req, res, next) => {
    try {
      const {
        params: { id: userId }
      } = req

      response({
        error: false,
        message: await new UserService({ userId }).getUserByID(),
        res,
        status: 200
      })
    } catch (error) {
      next(error)
    }
  })
  .delete(tokenValidator(),validatorCompiler(userIDSchema, 'params'), async (req, res, next) => {
    try {
      const {
        params: { id }
      } = req

      response({
        error: false,
        message: await new UserService({ userId: id }).removeUserByID(),
        res,
        status: 200
      })
    } catch (error) {
      next(error)
    }
  })
  .patch(
    tokenValidator(),
    validatorCompiler(userIDSchema, 'params'),
    validatorCompiler(updateUserSchema, 'body'),
    async (req, res, next) => {
      const {
        body: { name, lastName, email, password },
        params: { id }
      } = req

      try {
        response({
          error: false,
          message: await new UserService({
            userId: id,
            name,
            lastName,
            email,
            password
          }).updateUserByID(),
          res,
          status: 200
        })
      } catch (error) {
        next(error)
      }
    }
  )

module.exports = UserRouter
