const jwt = require("jsonwebtoken");
const register = require("../models/register");
require('dotenv').config();


const auth = async (req,res,next)=>{
    try {
        
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, "mynameisrajbirsinghkhokharmanjitsingh");
        const user = await register.findOne({_id:verifyUser._id})

        req.token = token;
        req.user = user; 

        next();

    } catch (error) {
        res.status(400).send(error)
    }

}
module.exports = auth;
