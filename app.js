//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose  = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology:true});

const userSchema = new mongoose.Schema({
    email :String,
    password:String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields: ["password"] });
/*THIS CODE OF LINE ALWAYS ABOVE OF MONGOOSE MODEL BECAUSE USERSCHEMA IS USED IN MODEL*/

const user = new mongoose.model("user",userSchema)


app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
     
    const newuser = new user({
        email:req.body.username,
        password:req.body.password
    });
    newuser.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets");
        }
    });
});

app.post("/login",function(req,res){
    const email = req.body.username;
    const password = req.body.password;
    user.findOne({email:email},function(err,found){
        if(err){
            console.log(err);
        }
        else{
            if(found){
                if(found.password===password){
                    res.render("secrets");
                }
            }
        }
    });
});


































    
app.listen(3000,function(){
    console.log("server is up at port 3000");
})