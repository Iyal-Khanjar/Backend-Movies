const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const generateToken = require('../utils/generateToken')
const userData = require('../userData')

// const { OAuth2Client } = require('google-auth-library');
// const {google} = require('googleapis')
// const {OAuth2} = google.auth
// const client = new OAuth2('539350701251-j3ols9991tnjr3lomv2t98ijof353f9o.apps.googleusercontent.com')

// all users profiles
const allUsersProfile = asyncHandler(async (req, res) => {
    // if we want to get registerd users (ayal,timor,shadi all admins)
    // await User.insertMany(userData.users);

    const data = await User.find({});
    return res.status(200).send(data)
})

// get user by id
const getUserById = asyncHandler((req, res) => {
    const id = req.params.id
    User.find({ _id: id }, (err, data) => {
        if (err) throw err
        res.status(200).send(data)
    })
})

// register
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic, isAdmin, favortieMovies } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(404);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
        isAdmin,
        favortieMovies
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            favortieMovies: user.favortieMovies,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("User not found");
    }
});

// auth User (signin)
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            favortieMovies: user.favortieMovies,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid Email or Password!')
    }
})

// update User
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { name, email, password, pic, favortieMovies } = req.body;
    if (user) {
        user.name = name || user.name;
        user.email = email || user.email;
        user.pic = pic || user.pic;
        user.favortieMovies = favortieMovies || user.favortieMovies;
        if (password) {
            user.password = password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            pic: updatedUser.pic,
            isAdmin: updatedUser.isAdmin,
            favortieMovies: updatedUser.favortieMovies,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error("User Not Found");
    }
});


// delete user
const deleteUser = asyncHandler((req, res) => {
    const _id = req.params.id;
    User.findByIdAndDelete(_id, (err, data) => {
        if (err) throw err;
        if (data) {
            return res.status(200).json({ deletedObj: data });
        }
        return res.status(400).json({ deletedObj: 'Not Found' })
    })
})


// google login
const googleLogin = asyncHandler(async (req, res) => {
    try {
        const { tokenId } = req.body

        const verify = await client.verifyIdToken({ idToken: tokenId, audience: process.env.MAILING_SERVICE_CLIENT_ID })

        const { email_verified, email, name, picture } = verify.payload

        const password = email + process.env.GOOGLE_SECRET

        const passwordHash = await bcrypt.hash(password, 12)

        if (!email_verified) return res.status(400).json({ msg: "Email verification failed." })

        const user = await User.findOne({ email })

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Password is incorrect." })

            const refresh_token = createRefreshToken({ id: user._id })
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })

            res.json({ msg: "Login success!" })
        } else {
            const newUser = new User({
                name, email, password: passwordHash, avatar: picture
            })

            await newUser.save()

            const refresh_token = createRefreshToken({ id: newUser._id })
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })

            res.json({ msg: "Login success!" })
        }


    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})
module.exports = {
    registerUser,
    authUser,
    allUsersProfile,
    getUserById,
    updateUserProfile,
    deleteUser,
    googleLogin
}