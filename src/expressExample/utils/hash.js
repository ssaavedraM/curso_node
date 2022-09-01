const { createHash } = require('crypto')
const { nanoid } = require('nanoid')

const hashString = (string, salt = '') => {
  const newsalt = salt || nanoid(20)

  const hash = createHash('sha256')

  hash.update(`${string}${newsalt}`)

  const result = hash.digest('hex')

  return { newsalt, result }
}

module.exports = { hashString }
