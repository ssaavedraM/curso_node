const { Router } = require('express')
const { nanoid } = require('nanoid')

const {
  article: { storeArticleSchema, updateArticleSchema, articleIDSchema }
} = require('../../schemas')
const { validatorCompiler } = require('./utils')
const {
  mongo: { queries }
} = require('../../database')
const response = require('./response')

const ArticleRouter = Router()
const {
  article: {
    getAllArticles,
    saveArticle,
    removeOneArticle,
    updateOneArticle,
    getOneArticle
  }
} = queries

ArticleRouter.route('/article')
  .get(async (req, res, next) => {
    try {
      const articles = await getAllArticles()

      response({ error: false, message: articles, res, status: 200 })
    } catch (error) {
      next(error)
    }
  })
  .post(
    validatorCompiler(storeArticleSchema, 'body'),
    async (req, res, next) => {
      try {
        const {
          body: { name, price, image, description }
        } = req

        await saveArticle({
          id: nanoid(),
          name,
          price,
          image,
          description
        })
        response({
          error: false,
          message: await getAllArticles(),
          res,
          status: 201
        })
      } catch (error) {
        next(error)
      }
    }
  )

ArticleRouter.route('/article/:id')
  .get(validatorCompiler(articleIDSchema, 'params'), async (req, res, next) => {
    try {
      const {
        params: { id }
      } = req
      const article = await getOneArticle(id)

      response({ error: false, message: article, res, status: 200 })
    } catch (error) {
      next(error)
    }
  })
  .delete(
    validatorCompiler(articleIDSchema, 'params'),
    async (req, res, next) => {
      try {
        const {
          params: { id }
        } = req

        await removeOneArticle(id)
        response({
          error: false,
          message: await getAllArticles(),
          res,
          status: 200
        })
      } catch (error) {
        next(error)
      }
    }
  )
  .patch(
    validatorCompiler(articleIDSchema, 'params'),
    validatorCompiler(updateArticleSchema, 'body'),
    async (req, res, next) => {
      const {
        body: { name, price, image, description },
        params: { id }
      } = req

      try {
        await updateOneArticle({ id, name, price, image, description })
        response({
          error: false,
          message: await getAllArticles(),
          res,
          status: 200
        })
      } catch (error) {
        next(error)
      }
    }
  )

module.exports = ArticleRouter

// JSON - DIC - BSON
