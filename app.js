require('dotenv').config()
const mongoose = require('mongoose')
const db = mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology:true})
const bp = require('body-parser')
const express = require('express')
const app = express()
const ejs = require('ejs')
app.use(express.static('public'))
app.set('view engine','ejs')
app.use(bp.urlencoded({extended:true}))
const encrypt = require('mongoose-encryption')
const userSchema = new mongoose.Schema({
  username:String,
  password:String
})

userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:['password']})

const users = mongoose.model("user",userSchema)

// get request handlers
app.get("/",function(req,res){
  res.render('home')
})

app.get("/login",function(req,res){
  res.render('login')
})

app.get("/register",function(req,res){
  res.render('register')
})

// post request handlers
app.post("/register", function(req,res){
  const user = new users({
    username:req.body.username,
    password:req.body.password
  })
  user.save(function(err){
    if(err)
    res.send(err)
    else
    res.render("secrets")
  })

})

app.post("/login", function(req,res){
  const uname = req.body.username
  const pass = req.body.password
  users.findOne({username:uname},function(err,data){

    if(data.password===pass)
    res.render("secrets")
    else{
      res.send("404 not found")
    }
  })
})

app.listen(3000)
