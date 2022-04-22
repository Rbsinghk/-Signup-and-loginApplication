const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const new_mongoose = new mongoose.Schema({

    name: {
        type:String,
        required:true
    },
    gender: {
        type:String,
        required:true
    },
    phone: {
        type:Number,
        required:true,
    },
    email: {
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    },
    password: {
        type:String,
        required:true  
    }
})

new_mongoose.pre("save", async function(next){

    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 5);
    }
    next();
})


const register = new mongoose.model("register", new_mongoose);
module.exports=register;