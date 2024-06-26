const {Router} = require('express')
const verifyJWT = require('../middleware/auth')
const { createTweet, deleteTweet, likeOrDislike, getAllTweets, getFollowingTweets } = require('../controller/tweetcontroller')


const route = Router()


route.post('/create' ,verifyJWT,createTweet)
route.delete('/delete/:id' ,verifyJWT,deleteTweet)
route.put('/like/:id' ,verifyJWT,likeOrDislike)
route.get('/alltweets/:id' ,verifyJWT ,getAllTweets)
route.get('/followingtweets/:id' ,verifyJWT ,getFollowingTweets)





module.exports = route