const httpErrors = require('http-errors')
const {
  mongo: { queries }
} = require('../database')
const { roles: {ROLE_IDS,ROLE_NAMES} } = require('../utils')
const {
  role: {
    getRoleByID,
    saveRole,
    getRoleByName,
    getAllRoles,
    removeRoleByID,
    updateOneRole
  }
} = queries

class RoleService {
  #id
  #name

  /**
   * @param {Object} args
   * @param {String} args.id
   * @param {String} args.name
   */
  constructor(args = {}) {
    const {
      id = '',
      name = ''
    } = args

    if(!ROLE_IDS.includes(`${id}`))
        throw new httpErrors.BadRequest('Role ID not allowed')

    if(!ROLE_NAMES.includes(name))
        throw new httpErrors.BadRequest('Role name not allowed')
    
    this.#id = id
    this.#name = name

  }

  async verifyRoleExists() {
    if (!this.#id)
      throw new httpErrors.BadRequest('Missing required field: id')

    const role = await getRoleByID(this.#id)

    if (!role) throw new httpErrors.NotFound('Role not found')

    return role
  }

  async saveRole() {
    if (!ROLE_NAMES.includes(this.#name))
      throw new httpErrors.BadRequest('Role name not allowed')

    const roleExist = await getRoleByName(this.#name)

    if (roleExist)
      throw new httpErrors.Conflict('Role already exist')

    await saveRole({
      id: this.#id,
      name: this.#name
    })

    return await getAllRoles()
  }

  async getRoleByID() {
    if (!this.#id)
      throw new httpErrors.BadRequest('Missing required field: userId')

    const user = await getRoleByID(this.#id)

    if (!user)
      throw new httpErrors.NotFound('The requested Role does not exist')

    return user
  }

  async getAllRoles() {
    return await getAllRoles()
  }

  async removeRoleByID() {
    if (!this.#id)
      throw new httpErrors.BadRequest('Missing required field: userId')

    const user = await removeRoleByID(this.#id)

    if (!user)
      throw new httpErrors.NotFound('The requested Role does not exist')

    return this.getAllRoles()
  }

  async updateRoleByID() {
    if (!this.#id)
      throw new httpErrors.BadRequest('Missing required field: userId')

    return await updateOneRole({
      id: this.#id,
      name: this.#name,
    })
  }

}

module.exports = RoleService
