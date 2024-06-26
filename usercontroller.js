const User = require('../models/usermodel')
const bcrypt = require('bcrypt')
const jwt  = require('jsonwebtoken')


const registerUser = async(req,res)=>{
    
    const {name,password,email,username} = req.body

    if(!name||!password||!email||!username){
        return res.send({
            success:'false',
            message:'all fields are required'

        })
    }

    const user = await User.findOne({email})

    if(user){
        return res.send({
            success:false,
            message:'user is already registered'
        })
    }

    const hashedpassword = await bcrypt.hash(password , 10)


        await User.create({
           name,
           email,
           username,
           password:hashedpassword
        })

        return res.send({
           success:true,
           message:'User created successfully' 
        })
}

const loginUser = async(req,res)=>{

     const{email , password} = req.body

     if(!email || !password){
        return res.send({
           success:false,
           message:'all fields are required'
         })
     }

     const user = await User.findOne({email})
     if(!user){
        return res.send({
           success:false,
           message:'User is not registered'
        })
     }


     const isMatch = await bcrypt.compare(password , user.password)

     if(!isMatch){
       return res.send({
          success:false,
          message:'password is not correct'
       }) 
     } 


     const token = await jwt.sign({_id:user._id }, process.env.TOKEN_SECRET, {expiresIn: "1d"} )
     
     return res.cookie("token" , token , {expiresIn:"1d" ,httpOnly:true}).json({
        success:true,
        user,
        message:`Welcome back ${user.name}`,
           
     })

   
  

     
}

 const logoutUser = (req,res)=>{
       return res.cookie("token","" , {expiresIn:new Date(Date.now())}).json({
          message: 'User logout successfully',
          success:true
       })  
   }

const bookmark = async(req,res)=>{
    const loggedInUserId = req.body.id
    const tweetId = req.params.id

    const user = await User.findById(loggedInUserId)

    if(user.bookmarks.includes(tweetId)){
            await User.findByIdAndUpdate(loggedInUserId ,{$pull:{bookmarks: tweetId}} )
             return res.send({
                message:"tweet is removed",
                success:true
             })
    } else{
       await User.findByIdAndUpdate(loggedInUserId ,{$push:{bookmarks: tweetId}} )
             return res.send({
                message:"tweet is added",
                success:true
             })
    }
}

const getMyProfile =async(req,res)=>{

    const id = req.params.id
    const user = await User.findById(id).select("-password");
    return res.send({
      user,
      success:true
    })
}
 

const getOtherUsers = async(req,res)=>{

    const {id} = req.params
    const other = await User.find({_id: {$ne:id}}).select("-password")

    if(!other){

      return res.send({
         message:'currently do not have any users',
         success:false
      })
    }

     return res.send({
      other,   
      message:'fetched successfully',
         success:true
      })
}

const follow = async(req,res)=>{
      
   const loggedInUserId = req.body.id
   const userId = req.params.id

   const loggedInUser = await User.findById(loggedInUserId)
   const user = await User.findById(userId)
   
   if(!user.followers.includes(loggedInUserId)){

      await user.updateOne({$push:{followers:loggedInUserId}})
      await loggedInUser.updateOne({$push:{following:userId}})
   }else{
      return res.send({
         message:'User already followed'
      })   
   
   }

   return res.send({
      message:`${loggedInUser.name} just followed ${user.name}`
   })
}

const unfollow  =async(req,res)=>{

     const loggedInUserId = req.body.id
     const userId = req.params.id

     const loggedInUser = await User.findById(loggedInUserId)
     const user = await User.findById(userId)

     if(loggedInUser.following.includes(userId)){
         await user.updateOne({$pull:{followers:loggedInUserId}})
         await loggedInUser.updateOne({$pull:{following:userId}})
     } else{
       return res.send({
         message:'user has not followed yet'
       })
     }

     return res.send({
      message:`${loggedInUser.name} unfollow to ${user.name}`
     })
}


module.exports = {registerUser, loginUser , logoutUser, bookmark , getMyProfile,getOtherUsers,follow , unfollow}