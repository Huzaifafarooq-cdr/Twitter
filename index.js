const express = require('express')
require('dotenv').config()
const {db} = require('./database/db')
const route = require('./routes/userroutes') 
const tweetRoute = require('./routes/tweetroutes')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()


app.use(express.json())

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())

const corsOptions = {
    origin:"http://localhost:5173",
    credentials:true
}

app.use(cors(corsOptions))

app.use("/api/v1" , route)
app.use("/api/v1" , tweetRoute)

db();



app.listen(process.env.Port , ()=>{
      
    console.log(`Server is running on ${process.env.PORT}`)

})