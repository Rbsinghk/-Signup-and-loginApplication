const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/4-19-22",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>{
    console.log("Mongoose is Connected");
})
.catch((e)=>{
    console.log("Mongoose is Not Connected");
})