// require variables
const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const session = require("express-session");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// express-session setup
app.use(
    session({
        secret: "test",
        resave: false,
        saveUninitialized: false,
    })
);

// mongo connection
mongoose.connect("mongodb://127.0.0.1/fitnessDB");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    sex: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    userPassword: {
        type: String,
        required: true,
    },
    waterGoal: {
        type: Number,
    },
    exerciseGoal: {
        type: Number,
    },
    calorieGoal: {
        type: Number,
    },
});

const user = mongoose.model("user", userSchema);

// app.gets

app.get("/signup", function (req, res) {
    res.render("signup");
});

app.get("/signin", function (req, res) {
    res.render("signin");
});

app.get("/home", function (req, res) {
    if (!req.session.isLoggedIn) {
        res.redirect("/signin");
        return;
    }
    const hour = new Date().getHours();
    let timeGreeting;
    if (hour < 5 || hour > 17) {
        timeGreeting = "Good Evening, ";
    } else if (hour > 5 && hour < 12) {
        timeGreeting = "Good Morning, ";
    } else {
        timeGreeting = "Good Afternoon, ";
    }
    res.render("home", {
        firstName: req.session.firstName,
        timeGreeting: timeGreeting,
    });
});

// Display and personalize water, calorie, and exercise goals
app.get("/setup", function (req, res) {
    if (!req.session.isLoggedIn) {
        res.redirect("/signin");
        return;
    }
    user.findOne({ userName: req.session.userName }).then((foundUser) => {
        req.session.sex = foundUser.sex;
        // male algorithms
        if (req.session.sex == "male") {
            user.findOne(
                { userName: req.session.userName })
                .then(() => {
                    foundUser.waterGoal = 125;
                    if (!foundUser.calorieGoal) {
                        foundUser.calorieGoal =
                            (66.47 + 6.24 * foundUser.weight + 12.7 * foundUser.height - 6.755 * foundUser.age) * 1.4;
                        // BMR = 66.47 + ( 6.24 × weight in pounds ) + ( 12.7 × height in inches ) − ( 6.755 × age in years ); PAL (light exercise) = 1.4
                        foundUser.save();
                    }
                    let calorieGoal = Math.round(foundUser.calorieGoal);
                    let waterGoal = foundUser.waterGoal;
                    res.render("setup", {
                        firstName: req.session.firstName,
                        waterGoal: waterGoal,
                        exerciseGoal: req.session.exerciseGoal,
                        calorieGoal: calorieGoal,
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
                // female algorithms
        } else if (req.session.sex == "female") {
            user.findOne(
                { userName: req.session.userName })
                .then(() => {
                    foundUser.waterGoal = 91;
                    if (!foundUser.calorieGoal) {
                        foundUser.calorieGoal =
                            (655.1 + 4.35 * foundUser.weight + 4.7 * foundUser.height - 4.7 * foundUser.age) * 1.4;
                        // BMR = 655.1 + ( 4.35 × weight in pounds ) + ( 4.7 × height in inches ) − ( 4.7 × age in years )
                        foundUser.save();
                    }
                    let calorieGoal = Math.round(foundUser.calorieGoal);
                    let waterGoal = foundUser.waterGoal;
                    res.render("setup", {
                        firstName: req.session.firstName,
                        waterGoal: waterGoal,
                        exerciseGoal: req.session.exerciseGoal,
                        calorieGoal: calorieGoal,
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    });
});

// app.posts

app.post("/newUser", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const userName = req.body.userName;
    const sex = req.body.sex;
    const age = req.body.age;
    const weight = req.body.weight;
    const feet = Number(req.body.feet);
    const inches = Number(req.body.inches);
    const height = Number(feet * 12 + inches);
    const userPassword = req.body.password;
    const exerciseGoal = 30;
    bcrypt.hash(userPassword, saltRounds, function (err, hash) {
        if (err) {
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
                userPassword: hashedPassword,
                exerciseGoal: exerciseGoal,
            });
            newUser.save();
            res.render("signin");
        }
    });
});

app.post("/signin", function (req, res) {
    const userName = req.body.userName;
    const password = req.body.password;
    user.findOne({ userName: userName }).then((foundUser) => {
        // Setup needed session variables
        req.session.userName = foundUser.userName;
        req.session.isLoggedIn = true;
        req.session.firstName = foundUser.firstName;
        req.session.calorieGoal = foundUser.calorieGoal;
        req.session.exerciseGoal = foundUser.exerciseGoal;
        req.session.waterGoal = foundUser.waterGoal;

        

        const foundPassword = foundUser.userPassword;

        bcrypt.compare(password, foundPassword, function (err, result) {
            if (err) {
                console.log(err);
            } else if (result) {
                console.log("Success");
                res.redirect("/home");
                console.log(req.session.waterGoal);
            } else {
                console.log("incorrect password");
                res.redirect("/signin");
            }
        });
    });
});

// Signout Function
app.post("/signout", function (req, res) {
    req.session.isLoggedIn = false;
    res.redirect("/signin");
});

// pass variables to Chart Maker
app.get(
    "/api/goalVariables/:waterVariable/:exerciseVariable/:calorieVariable",
    function (req, res) {
        let waterVariable = req.params.waterVariable;
        let exerciseVariable = req.params.exerciseVariable;
        let calorieVariable = req.params.calorieVariable;

        waterVariable = req.session.waterGoal;
        exerciseVariable = req.session.exerciseGoal;
        calorieVariable = req.session.calorieGoal;

        res.json({ waterVariable, exerciseVariable, calorieVariable });
    }
);

// connect to host

app.listen(3000, function (req, res) {
    console.log("server is running on port 3000");
});

