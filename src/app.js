require("dotenv").config();
const express = require("express");
const app = express();
require("./db/conn"); //include db connection
const register = require("./models/register"); // put name as userSchema
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");
const async = require("hbs/lib/async");
const port = process.env.PORT || 4000;
// console.log(process.env.AUTH_STRING)

const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path));
const template_path = path.join(__dirname, "../templates/views");
app.set("view engine", "hbs");
app.set("views", template_path);
const partials = path.join(__dirname, "../templates/partials");
hbs.registerPartials(partials);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("register");
});
app.get("/index", auth, (req, res) => {
  res.render("index");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/logout",auth, async(req, res) => {
  try {

    /*For Single Logout
    req.user.tokens = req.user.tokens.filter((currElement)=>{
      return currElement.token !== req.token
    })*/

    /*Logout from all devices
    req.user.tokens = [];*/

    res.clearCookie("jwt");
    await req.user.save();
    res.render("login");
  } catch (error) {
    res.status(500).send("yo")
  }
});

app.get("/find", async (req, res) => {
  try {
    const allUserInfo = await register.find({});
    res.status(200).send(allUserInfo);
  } catch (error) {
    console.log(error);
  }
});
app.get("/find/:id", async (req, res) => {
  try {
    const user = await register.findById(req.params.id);
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
  }
});

app.post("/register", async (req, res) => {
  try {
    const new_register = new register({
      name: req.body.name,
      gender: req.body.gender,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
    });

    const token = await new_register.generateAuthToken();

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 300000),
    });
    const reg = await new_register.save();
    res.status(201).render("login");
  } catch (error) {
    res.status(400).send(error);
  }
});
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const usermail = await register.findOne({ email: email });

    const isMatch = await bcrypt.compare(password, usermail.password);

    const token = await usermail.generateAuthToken();
    console.log(token);

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 300000),
      httpOnly: true,
    });

    if (isMatch) {
      res.status(201).render("index");
    } else {
      res.send("Invalid Username or Password");
    }
  } catch (error) {
    res.status(400).send("Invalid email");
  }
});

app.listen(port, () => {
  console.log(`The Port is Running at ${port}`);
});
