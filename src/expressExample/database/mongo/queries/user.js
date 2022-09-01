const { UserModel } = require('../models')

/**
 * @param {Object} user
 * @param {String} user.id
 * @param {String} user.name
 * @param {String} user.lastName
 * @param {String} user.email
 * @param {String} user.salt
 * @param {String} user.hash
 * @param {import('mongoose').Schema.Types.ObjectId} user.role
 * @returns saved user
 */
const saveUser = async user => {
  const savedUser = new UserModel(user)

  await savedUser.save()

  return savedUser
}

/**
 * @param {String} id
 * @returns found user
 */
const getUserByID = async id => {
  const users = await UserModel.find({ id })

  return users[0]
}

/**
 * @returns found users
 */
const getAllUsers = async () => {
  const users = await UserModel.find().populate('role')

  return users
}

/**
 * @param {String} id
 * @returns found user
 */
const removeUserByID = async id => {
  const user = await UserModel.findOneAndRemove({ id }).populate('role')

  return user
}

/**
 * @param {Object} user
 * @param {String} user.id
 * @param {String|undefined} user.name
 * @param {String|undefined} user.lastName
 * @param {String|undefined} user.email
 * @param {String|undefined} user.salt
 * @param {String|undefined} user.hash
 * @returns updated user
 */
const updateOneUser = async user => {
  const { id, name, lastName, email, salt, hash } = user
  const userUpdated = await UserModel.findOneAndUpdate(
    { id },
    {
      ...(name && { name }),
      ...(lastName && { lastName }),
      ...(email && { email }),
      ...(salt && hash && { salt, hash })
    },
    { new: true }
  )

  return userUpdated
}

/**
 *
 * @param {Object} query
 * @returns
 */
const getUserByPassword = async (query = {}) => {
  const users = await UserModel.find(query)

  return users[0]
}

module.exports = {
  saveUser,
  getUserByID,
  getAllUsers,
  removeUserByID,
  updateOneUser,
  getUserByPassword
}
