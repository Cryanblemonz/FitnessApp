const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require('bcrypt');
const saltRounds = 10;



const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1/fitnessDB");

const userSchema = mongoose.Schema({
        firstName: {
                type: String,
                required: true
        },
        lastName: {
                type: String,
                required: true
        },
        userName: {
                type: String,
                required: true
        },
        sex: {
                type: String,
                required: true
        },
        age: {
                type: Number,
                required: true
        },      
        weight: {
                type: Number,
                required: true
        },
        height: {
                type: Number,
                required: true
        },
        userPassword: {
                type: String,
                required: true
        }

})      

const user = mongoose.model("user", userSchema);

app.get("/signup", function (req, res) {
        res.render('signup');
});

app.get("/signin", function(req, res){
        res.render('signin');
})

app.get("/home", function(req, res){
        res.render('home');
})

app.post("/newUser", function(req, res){
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const userName = req.body.userName;
        const sex = req.body.sex;
        const age = req.body.age;
        const weight = req.body.weight;
        const feet = Number(req.body.feet);
        const inches = Number(req.body.inches);
        const height = Number((feet * 12) + inches);
        const userPassword = req.body.password;
        bcrypt.hash(userPassword, saltRounds, function(err, hash){
                if(err){
                        console.log(err);
                } else {
                        const hashedPassword = hash;
                        const newUser = new user({
                                firstName: firstName,
                                lastName: lastName,
                                userName: userName,
                                sex: sex,
                                age: age,
                                weight: weight,
                                height: height,
                                userPassword: hashedPassword
                        })
                        newUser.save();
                        res.render("signin");
                }
        })
});

app.post("/signin", function(req, res){
        const userName = req.body.userName;
        const password = req.body.password;
        user.findOne({userName: userName})
        .then(foundUser => {
                const foundPassword = foundUser.userPassword;
                console.log(foundPassword)
                bcrypt.compare(password, foundPassword, function(err, result){
                        if(err){
                                console.log(err)
                        } else if (result){
                                console.log('Success')
                        } else {
                                console.log('incorrect password')
                        }
                })

        })
})



app.listen(3000, function (req, res) {
    console.log("server is running on port 3000");
});
