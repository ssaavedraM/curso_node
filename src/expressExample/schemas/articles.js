const { Type } = require('@sinclair/typebox')

const storeArticleSchema = Type.Object({
  name: Type.String({ minLength: 4 }),
  price: Type.Number(),
  description: Type.String({ minLength: 10 }),
  image: Type.String({ minLength: 10 })
})

const updateArticleSchema = Type.Object({
  name: Type.Optional(Type.String({ minLength: 4 })),
  price: Type.Optional(Type.Number()),
  description: Type.Optional(Type.String({ minLength: 10 })),
  image: Type.Optional(Type.String({ minLength: 10 }))
})

const articleIDSchema = Type.Object({
  id: Type.String({ minLength: 21, maxLength: 21 })
})

module.exports = {
  storeArticleSchema,
  updateArticleSchema,
  articleIDSchema
}
