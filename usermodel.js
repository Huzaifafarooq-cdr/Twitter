const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    followers:{
        type:Array,
        default:[]
    },
    following:{
        type:Array, 
        default:[]
    },
    bookmarks:{
        type:Array,
        default:[]
    }
}, { timestamps: true });

module.exports = model('User', userSchema); 


