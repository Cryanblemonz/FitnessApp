// require variables
const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const session = require('express-session');

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// express-session setup
app.use(session({
        secret: 'test',
        resave: false,
        saveUninitialized: false
}));

// mongo connection
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
        },
        waterGoal: {
                type: Number
        },
        exerciseGoal: {
                type: Number
        },
        calorieGoal: {
                type: Number
        }

})      

const user = mongoose.model("user", userSchema);


// app.gets

app.get("/signup", function (req, res) {
        res.render('signup');
});

app.get("/signin", function(req, res){
        res.render('signin');
})

app.get("/home", function(req, res){
        if (!req.session.isLoggedIn) {
                res.redirect('/signin');
                return;
        }
        const hour = new Date().getHours();
        let timeGreeting
        if(hour < 5 || hour > 17){
                timeGreeting = "Good Evening, "
        } else if (hour > 5 && hour < 12){
                timeGreeting = "Good Morning, "
        } else {
                timeGreeting = "Good Afternoon, "
        }
        res.render('home', {firstName: req.session.firstName, timeGreeting: timeGreeting})
})

app.get("/setup", function(req, res){
        if (!req.session.isLoggedIn) {
                res.redirect('/signin');
                return;
        }
        user.findOne({userName: req.session.userName})
                .then(foundUser => {
                        req.session.sex = foundUser.sex
                        console.log(req.session.sex);
                        if (req.session.sex == "male") {
                                user.findOneAndUpdate({ userName: req.session.userName }, { waterGoal: 124 })
                                  .then(() => {
                                    foundUser.waterGoal = 125;
                                        if (!foundUser.calorieGoal){
                                                foundUser.calorieGoal = (66.47 + (6.24 * foundUser.weight) + (12.7 * foundUser.height) - (6.755 * foundUser.age)) * 1.4;
                                        // BMR = 66.47 + ( 6.24 × weight in pounds ) + ( 12.7 × height in inches ) − ( 6.755 × age in years ); PAL (light exercise) = 1.4
                                         foundUser.save();
                                        }
                                        let calorieGoal = Math.round(foundUser.calorieGoal);
                                    let waterGoal = foundUser.waterGoal;
                                    foundUser.save();
                                    res.render('setup', { firstName: req.session.firstName, waterGoal: waterGoal, exerciseGoal: 30, calorieGoal: calorieGoal});
                                  })
                                  .catch((err) => {
                                    console.log(err);
                                  });
                              } else if (req.session.sex == "female") {
                                user.findOneAndUpdate({ userName: req.session.userName }, { waterGoal: 91 })
                                  .then(() => {
                                    foundUser.waterGoal = 91;
                                    foundUser.save();
                                    let waterGoal = foundUser.waterGoal;
                                    res.render('setup', { firstName: req.session.firstName, waterGoal: waterGoal, exerciseGoal: "30"});
                                    console.log(waterGoal);
                                  })
                                  .catch((err) => {
                                    console.log(err);
                                  });
                              }
                              })
                        })

// app.posts

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
                req.session.userName = foundUser.userName;
                req.session.isLoggedIn = true;
                req.session.firstName = foundUser.firstName;
                const foundPassword = foundUser.userPassword;

                bcrypt.compare(password, foundPassword, function(err, result){
                        if(err){
                                console.log(err)
                        } else if (result){
                                console.log('Success')
                                res.redirect("/home")
                        } else {
                                console.log('incorrect password')
                                res.redirect("/signin")
                        }
                })

        })
})



// connect to host

app.listen(3000, function (req, res) {
    console.log("server is running on port 3000");
});
