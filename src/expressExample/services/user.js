const httpErrors = require('http-errors')
const { nanoid } = require('nanoid')
const RoleService = require('./role')
const {
  mongo: { queries }
} = require('../database')
const {
  user: {
    getUserByID,
    saveUser,
    getAllUsers,
    removeUserByID,
    updateOneUser,
    getUserByPassword
  }
} = queries
const { hashString } = require('../utils/hash')

class UserService {
  #userId
  #name
  #lastName
  #email
  #password
  #role

  /**
   * @param {Object} args
   * @param {String} args.userId
   * @param {String} args.name
   * @param {String} args.lastName
   * @param {String} args.email
   * @param {String} args.password
   * @param {String} args.role
   */
  constructor(args = {}) {
    const {
      userId = '',
      name = '',
      lastName = '',
      email = '',
      password = '',
      role = ''
    } = args

    this.#userId = userId
    this.#name = name
    this.#lastName = lastName
    this.#email = email
    this.#password = password
    this.#role = role
  }

  async verifyUserExists() {
    if (!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    const user = await getUserByID(this.#userId)

    if (!user) throw new httpErrors.NotFound('User not found')

    return user
  }

  async saveUser() {
    if (!this.#name)
      throw new httpErrors.BadRequest('Missing required field: name')

    if (!this.#lastName)
      throw new httpErrors.BadRequest('Missing required field: lastName')

    if (!this.#email)
      throw new httpErrors.BadRequest('Missing required field: email')

    if (!this.#password)
      throw new httpErrors.BadRequest('Missing required field: password')

    if (!this.#role)
      throw new httpErrors.BadRequest('Missing required field: role')

    const { newsalt: salt, result: hash } = hashString(this.#password)

    console.log(salt)
    console.log(hash)

    const roleService = new RoleService({id: this.#role})
    const foundRole = await roleService.verifyRoleExists()

    await saveUser({
      id: nanoid(),
      name: this.#name,
      lastName: this.#lastName,
      email: this.#email,
      salt,
      hash,
      role: foundRole._id
    })

    return await getAllUsers()
  }

  async getUserByID() {
    if (!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    const user = await getUserByID(this.#userId)

    if (!user)
      throw new httpErrors.NotFound('The requested User does not exist')

    return user
  }

  async getAllUsers() {
    return await getAllUsers()
  }

  async removeUserByID() {
    if (!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    const user = await removeUserByID(this.#userId)

    if (!user)
      throw new httpErrors.NotFound('The requested User does not exist')

    return this.getAllUsers()
  }

  async updateUserByID() {
    if (!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    const updatePassword = !!this.#password
    const aux = {}

    if (updatePassword) {
      const { salt, result: hash } = hashString(this.#password)

      aux.salt = salt
      aux.hash = hash
    }

    return await updateOneUser({
      id: this.#userId,
      name: this.#name,
      lastName: this.#lastName,
      email: this.#email,
      ...aux
    })
  }

  async login() {
    if (!this.#email)
      throw new httpErrors.BadRequest('Missing required field: email')

    if (!this.#password)
      throw new httpErrors.BadRequest('Missing required field: password')

    const user = await getUserByPassword({ email: this.#email })

    console.log(user.toObject)

    if (!user) throw new httpErrors.BadRequest('Wrong Credentials')

    const { salt, hash } = user
    const { result } = hashString(this.#password, salt)

    if (hash !== result) throw new httpErrors.BadRequest('Wrong Credentials')

    return true
  }
}

module.exports = UserService
