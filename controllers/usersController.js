const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc GET all users
// @route GET /users
// @acess Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean() //o select() não devolve o password
    if (!users) { //leia-se "se: eu não tiver users"
        return res.status(400).json({ message: 'No user Found'})
    }
    res.json(users)
})

// @desc Create new user
// @route POST /users
// @acess Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body

    // Confirm data
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required'})
    }

    //check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) { 
        return res.status(409).json({ message: 'duplicate username'})
    }

    // hash password
    const hashedPwd = await bcrypt.hash(password, 10) //salt rounds

    const userObject = { username, "password": hashedPwd, roles}

    // create and store new user
    const user = await User.create(userObject)

    if (user) { //created
        res.status(201).json({ message: `new user ${username} created`})
    } else {
        res.status(400).json({ message: 'Invalid user data received'})
    }
})

// @desc update a user
// @route PATCH /users
// @acess Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body

    //confirm data
    if(!id || !username || !Array.isArray(roles) || !roles.length || typeof active != 'boolean') {
        return res.status(400).json({ message: 'All fields are required'})
    }

    const user = await User.findById(id).exec()

    if(!user) {
        return res.status(400).json({ message: 'User not found'})
    }

    //check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()
    //allow updates to the original user
    if (!duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: "Duplicate username"})
    }

    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
        //hash pw
        user.password = await bcrypt.hash(password, 10);

        const updatedUser = await user.save();

        res.json({ message: `${updateUser.username} updated` });
    }
});

// @desc Delete a user
// @route DELETE /users
// @acess Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "user ID required" });
    }

    const notes = await Note.findOne({ user: id }).lean().exec();
    if (notes?.length) {
        return res.status(400).json({ message: "User has assigned notes" });
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const result = await user.deleteOne(); //assim o result vai "segurar" o deletado

    const reply = `Username ${result.username} with ID ${result._id} deleted`;

    res.json(reply);
});

//https://youtu.be/CvCiNeLnZ00?t=6867
module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}