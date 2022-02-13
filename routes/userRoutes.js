const express = require('express')
const userRouter = express.Router()
const { registerUser, authUser, deleteUser, updateUserProfile, allUsersProfile, googleLogin } = require("../controllers/userController.js")
const { bestActors , funniestActors,bestMovie } = require("../controllers/dataController.js")
const { protect } = require('../middlewares/authMiddleware')

userRouter.route('/allusersprofile').get(allUsersProfile)
userRouter.route('/register').post(registerUser)
userRouter.route('/signin').post(authUser)
userRouter.route('/google-login').post(googleLogin)
userRouter.route("/profile/").post(protect, updateUserProfile);
userRouter.route('/:id').delete(deleteUser)
userRouter.route('/bestActors').get(bestActors)
userRouter.route('/funniestActors').get(funniestActors)
userRouter.route('/bestMovies').get(bestMovie)



module.exports = userRouter
