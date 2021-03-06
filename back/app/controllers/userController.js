const _ = require('lodash')
const User = require('../models/userModel')
const cloudinary = require('cloudinary')
const { createQuerySearch } = require('../helper/index')


const getAllUsers = (req, res) => {
  User.find().lean().exec()
    .then(users => res.json(users))
    .catch(err => handdleError(err, res))
}

const getUserById = (req, res) => {
  const userId = req.params.id
  User.findById(userId)
    .then(user => res.json(user))
    .catch(err => handdleError(err, res))
}

const getUserRecipesById = (req, res) => {
  const userId = req.params.id
  User.findById(userId)
    .populate('recipes')
    .then(user => res.json(user.recipes))
    .catch(err => handdleError(err, res))
}

const searchWithFilters = (req, res) => {
  const querySearch = createQuerySearch(req.body.searchParams)
  User.find(querySearch)
    .then(response => res.json(response))
    .catch(err => handdleError(res, err))
}

const updateUser = (req, res) => {
  const userId = req.params.id
  const userUpdated = req.body

  User.findOneAndUpdate({ _id: userId },
    userUpdated,
    { new: true })
    .then(user => res.json(user))
    .catch(err => handdleError(err, res))
}

const updateUserRecipes = (req, res) => {
  const userId = req.params.id;
  const recipeId = req.body.recipe;

  User.findById(userId)
    .then(user => {
      user.recipes.push(recipeId)
      user.save()
        .then(() => res.json({
          msg: 'OK'
        }))
        .catch(err => handdleError(err, res))
    })
    .catch(err => handdleError(err, res))
}

const updateUserFollowing = (req, res) => {
  const userId = req.params.id;
  const followingId = req.body.following;

  User.findById(userId)
    .then(user => {
      user.following.push(followingId)
      user.save()
        .then(() => res.json({
          msg: 'OK'
        }))
        .catch(err => handdleError(err, res))
    })
    .catch(err => handdleError(err, res))
}


const getUserImg = (req, res) => {
  const { id } = req.params

  User.findById(id)
    .then(res => res.json(res.img))
    .catch(err => handdleError(err, res))
}

const updateUserImg = (req, res) => {
  const { id } = req.params
  const { img } = req.body

  User.findByIdAndUpdate({_id: id}, {img}, {new: true})
    .then(user => res.json(user))
    .catch(err => handdleError(err, res))
}

const deleteUserRecipe = (req, res) => {
  const userId = req.params.id;
  const recipeId = req.params.recipeId;

  User.findById(userId)
    .then(user => {
      user.recipes = user.recipes.filter(recipe => recipe != recipeId)
      user.save()
        .then(() => {
          res.json({
            msg: 'OK'
          })

        })
        .catch(err => handdleError(err, res))
    })
    .catch(err => handdleError(err, res))
}

function handdleError(err, res) {
  return res.status(400).json(err);
}

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  getUserRecipesById,
  updateUserRecipes,
  deleteUserRecipe,
  searchWithFilters,
  updateUserFollowing,
  getUserImg,
  updateUserImg
}