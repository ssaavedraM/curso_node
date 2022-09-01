const { ArticleModel } = require('../models')

/**
 *
 * @param {Object} article
 * @param {String} article.id
 * @param {String} article.name
 * @param {Number} article.price
 * @param {String} article.image
 * @param {String} article.description
 * @return saved article
 */
const saveArticle = async article => {
  const savedArticle = new ArticleModel(article)

  await savedArticle.save()

  return savedArticle
}

/**
 *
 * @param {String} id
 * @returns found Article
 */
const getOneArticle = async id => {
  const articles = await ArticleModel.find({ id })

  return articles[0]
}

/**
 *
 * @returns all Articles
 */
const getAllArticles = async () => {
  const articles = await ArticleModel.find()

  return articles
}

/**
 *
 * @param {String} id
 * @returns removed Article
 */
const removeOneArticle = async id => {
  const article = await ArticleModel.findOneAndRemove({ id })

  return article
}

/**
 *
 * @param {Object} article
 * @param {String} article.id
 * @param {String|undefined} article.name
 * @param {Number|undefined} article.price
 * @param {String|undefined} article.image
 * @param {String|undefined} article.description
 * @returns updated Article
 */
const updateOneArticle = async article => {
  const { id, name, price, image, description } = article
  const articleUpdated = await ArticleModel.findOneAndUpdate(
    { id },
    { name, price, image, description },
    { new: true }
  )

  return articleUpdated
}

module.exports = {
  saveArticle,
  getOneArticle,
  getAllArticles,
  removeOneArticle,
  updateOneArticle
}
