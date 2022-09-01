const { RoleModel } = require('../models')

/**
 * @param {Object} role
 * @param {String} role.id
 * @param {String} role.name
 * @returns saved role
 */
const saveRole = async role => {
  const savedRole = new RoleModel(role)

  await savedRole.save()

  return savedRole
}

/**
 * @param {String} id
 * @returns found role
 */
const getRoleByID = async id => {
  const roles = await RoleModel.find({ id })

  return roles[0]
}

/**
 * @param {String} id
 * @returns found role
 */
 const getRoleByName = async name => {
    const roles = await RoleModel.find({ name })
  
    return roles[0]
  }

/**
 * @returns found roles
 */
const getAllRoles = async () => {
  const roles = await RoleModel.find()

  return roles
}

/**
 * @param {String} id
 * @returns found role
 */
const removeRoleByID = async id => {
  const role = await RoleModel.findOneAndRemove({ id })

  return role
}

/**
 * @param {Object} role
 * @param {String} role.id
 * @param {String|undefined} role.name

 * @returns updated role
 */
const updateOneRole = async role => {
  const { id, name } = role
  const roleUpdated = await RoleModel.findOneAndUpdate(
    { id },
    {
      ...(name && { name })
    },
    { new: true }
  )

  return roleUpdated
}


module.exports = {
  saveRole,
  getRoleByID,
  getRoleByName,
  getAllRoles,
  removeRoleByID,
  updateOneRole
}
