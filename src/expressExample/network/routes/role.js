const { Router } = require('express')

const {
  role: { storeRoleSchema, updateRoleSchema}
} = require('../../schemas')
const { validatorCompiler } = require('./utils')
const response = require('./response')
const { RoleService } = require('../../services')

const RoleRouter = Router()

RoleRouter.route('/role')
  .get(async (req, res, next) => {
    try {
      response({
        error: false,
        message: await new RoleService({}).getAllRoles(),
        res,
        status: 200
      })
    } catch (error) {
      next(error)
    }
  })
  .post(validatorCompiler(storeRoleSchema, 'body'), async (req, res, next) => {
    try {
      const {
        body: { id, name }
      } = req

      response({
        error: false,
        message: await new RoleService({
          id, 
          name
        }).saveRole(),
        res,
        status: 201
      })
    } catch (error) {
      next(error)
    }
  })

RoleRouter.route('/role/:id').get(async (req, res, next) => {
    const {
        params: { id: id }
      } = req
    
    try {
      response({
        error: false,
        message: await new RoleService(id).getRoleByID(),
        res,
        status: 200
      })
    } catch (error) {
      next(error)
    }
  })

module.exports = RoleRouter
