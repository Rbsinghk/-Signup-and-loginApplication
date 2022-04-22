const express = require("express");
const app = express();
require("./db/conn");
const register = require("./models/register");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcrypt");
const port = process.env.PORT || 4000;

const static_path = path.join(__dirname,"../public");
app.use(express.static(static_path));
const template_path = path.join(__dirname,"../templates/views");
app.set("view engine","hbs");
app.set("views", template_path);
const partials = path.join(__dirname,"../templates/partials");
hbs.registerPartials(partials);

app.use(express.json());    
app.use(express.urlencoded({ extended: false }));

app.get("/",(req,res)=>{
    res.render("Index");
})
app.get("/index",(req,res)=>{
    res.render("Index");
})
app.get("/register",(req,res)=>{
    res.render("register")
})
app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/register", async (req,res)=>{
    try {
        const new_register = new register({
            name: req.body.name,
            gender: req.body.gender,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password
        });
        const reg = await new_register.save();
        // console.log(`${reg}`)
        res.status(201).render("index");

    } catch (error) {
        res.status(400).send(error)
    }
    })
app.post("/login", async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        const usermail = await register.findOne({email:email});

        const isMatch = await bcrypt.compare(password, usermail.password);

        if(isMatch){
            res.status(201).render("index");
        }
        else{
            res.send("Invalid Username or Password")
        }

    } catch (error) {
        res.status(400).send("yoyo+")
        
    }
})




app.listen(port,()=>{
    console.log(`The Port is Running at ${port}`);
})