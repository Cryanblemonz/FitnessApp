// require variables
const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const session = require("express-session");
let days = [];

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

// Day Schema
const daySchema = mongoose.Schema({
    date: {
        type: String,
    },
    waterProgress: {
        type: Number,
    },
    exerciseProgress: {
        type: Number,
    },
    calorieProgress: {
        type: Number,
    },
});
// Day Model
const day = mongoose.model("day", daySchema);

// Workout Schema
const workoutSchema = mongoose.Schema({
    name: String,
  });
  
  for (let i = 1; i <= 20; i++) {
    workoutSchema.add({
      [`exercise${i}`]: {
        type: String,
      },
    });
  }
  
// Workout model
const workout = mongoose.model("workout", workoutSchema);

// UserSchema
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
    days: [daySchema],

    workouts: [workoutSchema],
});
// User Model
const user = mongoose.model("user", userSchema);

// app.gets

app.get("/", function (req, res) {
    res.redirect("/home");
});

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
    user.findOne({userName: req.session.userName})
    .then(foundUser => {
        let workouts = foundUser.workouts
        res.render("home", {
            firstName: req.session.firstName,
            timeGreeting: timeGreeting,
            workouts: workouts
    })
    });
});

// Display and personalize water, calorie, and exercise goals
app.get("/setup", function (req, res) {
    if (!req.session.isLoggedIn) {
        res.redirect("/signin");
        return;
    } else {
        res.render("setup", {
            firstName: req.session.firstName,
            waterGoal: req.session.waterGoal,
            exerciseGoal: req.session.exerciseGoal,
            calorieGoal: Math.round(req.session.calorieGoal),
        });
    }
});

app.get("/calorieQuestions", function (req, res) {
    res.render("calorieQuestions", {
        firstName: req.session.firstName,
    });
});

let exercises = [];

app.get("/workouts", function (req, res) {
    if (!req.session.isLoggedIn) {
        res.redirect("/signin");
        return;
    } else {
    res.render("workouts", { exercises: exercises });
    }
});

app.post("/queue", (req, res) => {
    let selectedExercises = req.body.selectedExercises;
    if(exercises.length < 20){
        exercises.push(...selectedExercises);
        res.sendStatus(200);
    }
});

app.get("/logworkout", function(req, res){
    user.findOne({userName: req.session.userName})
    .then(foundUser => {
        let workouts = foundUser.workouts
        res.render('logworkout', { workouts: workouts, chosenWorkout: foundUser.workouts[1]} )
    })
})

app.post("/clear", function (req, res) {
    exercises = [];
    console.log(exercises);
    console.log("array cleared");
    res.redirect("/workouts");
});

app.post("/showWorkouts", function (req, res) {
    const request = require("request");
    let muscle = req.body.muscle;
    request.get(
        {
            url: "https://api.api-ninjas.com/v1/exercises?muscle=" + muscle,
            headers: {
                "X-Api-Key": "zGgdF2+Y4cdd1MJv0h/FCw==8bXrFC72ymStibRL",
            },
        },
        function (error, response, body) {
            if (error) return console.error("Request failed:", error);
            else if (response.statusCode != 200)
                return console.error(
                    "Error:",
                    response.statusCode,
                    body.toString("utf8")
                );
            else {
                let data = JSON.parse(body);
                let exercises = data.map((exercise) => exercise.name); // extract only the exercise names
                res.json({ exercises: exercises });
            }
        }
    );
});

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
                days: [],
            });
            newUser.save().then(() => {
                user.findOne({ userName: userName }).then((foundUser) => {
                    if (foundUser.sex == "male") {
                        foundUser.waterGoal = 125;
                        foundUser.calorieGoal =
                            (66.47 +
                                6.24 * foundUser.weight +
                                12.7 * foundUser.height -
                                6.755 * foundUser.age) *
                            1.4;
                        foundUser.save();
                    } else if (foundUser.sex == "female") {
                        foundUser.waterGoal = 91;
                        foundUser.calorieGoal =
                            (655.1 +
                                4.35 * foundUser.weight +
                                4.7 * foundUser.height -
                                4.7 * foundUser.age) *
                            1.4;
                        foundUser.save();
                    }
                });
            });
            res.render("signin");
        }
    });
});

app.post("/signin", function (req, res) {
    const userName = req.body.userName;
    const password = req.body.password;
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = today.getMonth() + 1;
    let dd = today.getDate();
    const formattedToday = mm + "/" + dd + "/" + yyyy;
    user.findOne({ userName: userName }).then((foundUser) => {
        // Setup needed session variables
        req.session.userName = foundUser.userName;
        req.session.isLoggedIn = true;
        req.session.firstName = foundUser.firstName;
        req.session.calorieGoal = foundUser.calorieGoal;
        req.session.exerciseGoal = foundUser.exerciseGoal;
        req.session.waterGoal = foundUser.waterGoal;
        req.session.sex = foundUser.sex;
        req.session.day = formattedToday;

        const foundPassword = foundUser.userPassword;

        bcrypt.compare(password, foundPassword, function (err, result) {
            if (err) {
                console.log(err);
            } else if (result) {
                let newDayExists = false;
                foundUser.days.forEach((day) => {
                    if (day.date === formattedToday) {
                        newDayExists = true;
                        return;
                    }
                });
                if (newDayExists) {
                    const today = foundUser.days.find(
                        (d) => d.date == formattedToday
                    );
                    req.session.waterProgress = today.waterProgress;
                    req.session.exerciseProgress = today.exerciseProgress;
                    req.session.calorieProgress = today.calorieProgress;
                    res.redirect("/home");
                } else {
                    let newDay = new day({
                        date: formattedToday,
                        waterProgress: 0,
                        exerciseProgress: 0,
                        calorieProgress: 0,
                    });
                    console.log(newDay);
                    foundUser.days.push(newDay);
                    foundUser.save().then(() => {
                        const today = foundUser.days.find(
                            (d) => d.date == formattedToday
                        );
                        if (today && today.waterProgress) {
                            req.session.waterProgress = today.waterProgress;
                            req.session.exerciseProgress =
                                today.exerciseProgress;
                            req.session.calorieProgress = today.calorieProgress;
                            res.redirect("/home");
                        }
                    });
                }
            } else {
                console.log("incorrect password");
                res.redirect("/signin");
            }
        });
    });
});

app.post("/saveWorkout", function (req, res) {
    user.findOne({ userName: req.session.userName })
      .then((foundUser) => {
        if (foundUser) {
          const newWorkout = new workout({
            name: req.body.workoutName,
          });
          for (let i = 0; i < exercises.length; i++) {
            newWorkout[`exercise${i + 1}`] = exercises[i];
          }
  
          console.log(newWorkout);
          foundUser.workouts.push(newWorkout);
          foundUser.save();
        } else {
          console.log("user not found");
        }
        console.log(req.session.userName);
      })
      .catch((error) => {
        console.log(error);
      })
      .then(() => {
        exercises = [];
        res.redirect("/home");
      });
  });
 
app.post("/deleteWorkout", function (req, res) {
    let workoutId = req.body.workoutId; 
    user.findOneAndUpdate(
        { userName: req.session.userName },
        { $pull: { workouts: { _id: workoutId } } }
      )
      .then((updatedUser) => {
        return updatedUser.save();
      })
      .then(() => {
        console.log("Deleted successfully workout " + workoutId);
        res.redirect("home");
      })
      .catch((err) => {
        console.error("Error deleting workout", err);
        res.redirect("home");
      });
  });

    
app.post("/chosenWorkout", function(req, res) {
    let workoutId = req.body.workoutId; 
    user.findOne({ userName: req.session.userName })
      .then(foundUser => {
        let workouts = foundUser.workouts;
        let chosenWorkout = workouts.find(workout => workout._id == workoutId);
        res.render('logworkout', { workouts: workouts, chosenWorkout: chosenWorkout });
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });
  
    

// Change Water Goal Manually
app.post("/waterChange", function (req, res) {
    user.findOne({ userName: req.session.userName }).then((foundUser) => {
        let newGoal = req.body.waterChange;
        foundUser.waterGoal = newGoal;
        foundUser.save();
        req.session.waterGoal = foundUser.waterGoal;
        res.redirect("/setup");
    });
});

// Change Exercise Goal Manually
app.post("/exerciseChange", function (req, res) {
    user.findOne({ userName: req.session.userName }).then((foundUser) => {
        let newGoal = req.body.exerciseChange;
        foundUser.exerciseGoal = newGoal;
        foundUser.save();
        req.session.exerciseGoal = foundUser.exerciseGoal;
        res.redirect("/setup");
    });
});

// Change Calories Goal Manually
app.post("/calChange", function (req, res) {
    user.findOne({ userName: req.session.userName }).then((foundUser) => {
        let newGoal = req.body.calChange;
        foundUser.calorieGoal = newGoal;
        foundUser.save();
        req.session.calorieGoal = foundUser.calorieGoal;
        res.redirect("/setup");
    });
});

// Change Calories Goal W/ Question Form
app.post("/customCals", function (req, res) {
    let activityLevel;
    let goal;

    switch (req.body.activityLevel) {
        case "lvl0":
            activityLevel = 1.2;
            break;
        case "lvl1":
            activityLevel = 1.4;
            break;
        case "lvl2":
            activityLevel = 1.55;
            break;
        case "lvl3":
            activityLevel = 1.725;
            break;
        case "lvl4":
            activityLevel = 1.9;
            break;
        default:
            activityLevel = 1.4;
    }
    switch (req.body.goal) {
        case "lose2":
            goal = -1000;
            break;
        case "lose1":
            goal = -500;
            break;
        case "lose.5":
            goal = -250;
            break;
        case "maintain":
            goal = 0;
            break;
        case "gain.5":
            goal = 250;
            break;
        case "gain1":
            goal = 500;
            break;
        case "gain2":
            goal = 1000;
            break;
        default:
            goal = 0;
    }
    user.findOne({ userName: req.session.userName }).then((foundUser) => {
        if (foundUser.sex == "male") {
            foundUser.calorieGoal =
                (66.47 +
                    6.24 * foundUser.weight +
                    12.7 * foundUser.height -
                    6.755 * foundUser.age) *
                    activityLevel +
                goal;
            foundUser.save();
            req.session.calorieGoal = foundUser.calorieGoal;
            res.redirect("/setup");
        } else if (foundUser.sex == "female") {
            foundUser.calorieGoal =
                (655.1 +
                    4.35 * foundUser.weight +
                    4.7 * foundUser.height -
                    4.7 * foundUser.age) *
                    activityLevel +
                goal;
            foundUser.save();
            req.session.calorieGoal = foundUser.calorieGoal;
            res.redirect("/setup");
        }
    });
});

// Log Water
app.post("/addWater", function (req, res) {
    user.findOne({ userName: req.session.userName }).then((foundUser) => {
        const today = foundUser.days.find((d) => d.date == req.session.day);
        console.log(
            today,
            req.body.logWater,
            req.session.waterProgress,
            today.waterProgress
        );
        today.waterProgress =
            req.session.waterProgress + Number(req.body.logWater);
        foundUser.save();
        req.session.waterProgress = today.waterProgress;
        res.redirect("/home");
    });
});

// Log Exercise
app.post("/addExercise", function (req, res) {
    user.findOne({ userName: req.session.userName }).then((foundUser) => {
        const today = foundUser.days.find((d) => d.date == req.session.day);
        console.log(
            today,
            req.body.logExercise,
            req.session.exerciseProgress,
            today.exerciseProgress
        );
        today.exerciseProgress =
            req.session.exerciseProgress + Number(req.body.logExercise);
        foundUser.save();
        req.session.exerciseProgress = today.exerciseProgress;
        res.redirect("/home");
    });
});

// Log Water
app.post("/addCalories", function (req, res) {
    user.findOne({ userName: req.session.userName }).then((foundUser) => {
        const today = foundUser.days.find((d) => d.date == req.session.day);
        console.log(
            today,
            Number(req.body.logCalories),
            req.session.calorieProgress,
            today.calorieProgress
        );
        today.calorieProgress =
            req.session.calorieProgress + Number(req.body.logCalories);
        foundUser.save();
        req.session.calorieProgress = today.calorieProgress;
        res.redirect("/home");
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

app.get(
    "/api/goalProgress/:waterProgress/:exerciseProgress/:calorieProgress",
    function (req, res) {
        let waterProgress = req.params.waterProgress;
        let exerciseProgress = req.params.exerciseProgress;
        let calorieProgress = req.params.calorieProgress;

        waterProgress = req.session.waterProgress;
        exerciseProgress = req.session.exerciseProgress;
        calorieProgress = req.session.calorieProgress;

        res.json({ waterProgress, exerciseProgress, calorieProgress });
    }
);

app.listen(3000, function (req, res) {
    console.log("server is running on port 3000");
});
