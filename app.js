const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");

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
        }

})      

const user = mongoose.model("user", userSchema);

// const BryanC = new user({
//         name: "Bryan Clemons",
//         age: 29,
//         weight: 180,
//         height: 67,
//         sex: "male"
// })
// BryanC.save();

app.get("/", function (req, res) {
        res.render('signup');
});

app.post("/newUser", function(req, res){
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const sex = req.body.sex;
        const age = req.body.age;
        const weight = req.body.weight;
        const feet = Number(req.body.feet);
        const inches = Number(req.body.inches);
        const height = Number((feet * 12) + inches);
        console.log(firstName, lastName, sex, age, weight, feet, inches, height);

        const newUser = new user({
                firstName: firstName,
                lastName: lastName,
                sex: sex,
                age: age,
                weight: weight,
                height: height
        })
        newUser.save();
})



app.listen(3000, function (req, res) {
    console.log("server is running on port 3000");
});
