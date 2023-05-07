const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')


router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createNewUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)

module.exports = router

//https://youtu.be/CvCiNeLnZ00?t=7697