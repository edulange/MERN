const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc GET all users
// @route GET /users
// @acess Private
const getAllUsers = asyncHandler(async (req, res) => {

})

// @desc Create new user
// @route POST /users
// @acess Private
const createNewUser = asyncHandler(async (req, res) => {
})

// @desc update a user
// @route PATCH /users
// @acess Private
const updateUser = asyncHandler(async (req, res) => {

})

// @desc Delete a user
// @route DELETE /users
// @acess Private
const deleteUser = asyncHandler(async (req, res) => {

})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}