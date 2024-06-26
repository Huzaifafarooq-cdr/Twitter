const jwt = require('jsonwebtoken')




const verifyJWT = (async (req, res, next) => {

    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message:'User not authenticated'
        })
    }

    const decode = await jwt.verify(token , process.env.TOKEN_SECRET)
    req.user = decode.userId
    next()

})

module.exports =  verifyJWT 