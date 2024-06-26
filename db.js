const { connect } = require("mongoose")

const db = ()=>{
connect(process.env.DB_URL).then(()=>{
    console.log("db connected")
}).catch((err)=>{
    console.log(err)
})
}

module.exports = {db}
