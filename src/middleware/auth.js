const jwt = require("jsonwebtoken");
const register = require("../models/register");

const auth = async (req,res,next)=>{
    try {
        
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, "mynameisrajbirsinghkhokharmanjitsingh");
        next();

    } catch (error) {
        res.status(400).send(error)
    }

}
module.exports = auth;
