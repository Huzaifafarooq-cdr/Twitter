const Tweet = require('../models/tweetmodel')
const User = require('../models/usermodel')



const createTweet = async(req,res)=>{

    const {description ,id} = req.body

      if(!description || !id){
            return res.send({
                success:false,
                message:'all fields are required'
            })

      }

      const user = await User.findById(id).select("-password")

      await Tweet.create({
          description,
          userId:id,
          userDetails:user
    })

    return res.send({
        success:true,
        message:'Tweet is created'
    })

}

const deleteTweet = async (req, res) => {
    try {
        const { id } = req.params;
        const tweet = await Tweet.findByIdAndDelete(id);
        
        if (!tweet) {
            return res.status(404).json({
                success: false,
                message: 'Tweet not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Tweet is successfully deleted',
            tweet
        });
    } catch (error) {
        console.error('Error deleting tweet:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const likeOrDislike = async(req,res)=>{
    
    const loggedInUserId = req.body.id
    const tweetId = req.params.id

    const tweet = await Tweet.findById(tweetId)
    if(tweet.like.includes(loggedInUserId)){
        await Tweet.findByIdAndUpdate(tweetId , {$pull:{like: loggedInUserId}})
        return res.send({
            message:'User disliked your tweet',
            success:true
        })
    } else{
        await Tweet.findByIdAndUpdate(tweetId , {$push:{like:loggedInUserId}})
        return res.send({
            message:'User like your tweet',
            success:true
        })
    }


}

const getAllTweets = async(req,res)=>{    
     
      const id = req.params.id

      
 

      const loggedInUser = await User.findById(id);
      const loggedInUserTweets = await Tweet.find({userId:id});
      const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUsersId)=>{
            return Tweet.find({userId:otherUsersId})
      }))
      return res.status(200).json({
         tweets:loggedInUserTweets.concat(...followingUserTweet)
      })
} 

const getFollowingTweets = async(req,res)=>{
      const id = req.params.id
 

      const loggedInUser = await User.findById(id);
      
      const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUsersId)=>{
            return Tweet.find({userId:otherUsersId})
      }))
      return res.status(200).json({
         tweets:[].concat(...followingUserTweet)
      })
}

module.exports = {createTweet ,deleteTweet , likeOrDislike, getAllTweets, getFollowingTweets}