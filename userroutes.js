const {Router} = require('express')
const { registerUser, loginUser, logoutUser, bookmark, getMyProfile, getOtherUsers, follow, unfollow } = require('../controller/usercontroller')
const verifyJWT = require('../middleware/auth')
const { getAllTweets } = require('../controller/tweetcontroller')

const route = Router()

route.post('/register' , registerUser)
route.post('/login' , loginUser)
route.post('/logout' , logoutUser)
route.put('/bookmark/:id' ,verifyJWT,bookmark)
route .get('/profile/:id' , verifyJWT , getMyProfile)
route .get('/otheruser/:id' , verifyJWT , getOtherUsers)
route .post('/follow/:id' , verifyJWT , follow)
route .post('/unfollow/:id' , verifyJWT , unfollow)

module.exports = route