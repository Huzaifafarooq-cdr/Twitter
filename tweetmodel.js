const {Schema ,model} = require('mongoose')
const mongoose = require('mongoose')


const tweetSchema = new Schema({
     
    description:{
        type:String,
        required:true
    },
    like:{
        type:Array,
        default:[]
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    userDetails:{
        type:Array,
        default:[]
    }

},{timestamps:true})

module.exports = model('Tweet' , tweetSchema)