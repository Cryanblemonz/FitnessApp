    document.addEventListener("DOMContentLoaded", function() {
    const toggleButton = document.querySelector(".toggle-button");
    const workouts = document.querySelector("#saved-workouts");
    const dashboard = document.querySelector("#dashboard");
    

    toggleButton.addEventListener("click", function () {
        workouts.classList.toggle("collapsed-div");
        dashboard.classList.toggle("col-lg-9");
        dashboard.classList.toggle("col-lg-12");
        toggleButton.textContent = workouts.classList.contains("collapsed-div")
            ? "<"
            : ">";
    });
    
    fetch('/api/goalVariables/waterVariable/exerciseVariable/calorieVariable')
        .then(response => response.json())
        .then(data => {
        const waterVariable = data.waterVariable;
        const exerciseVariable = data.exerciseVariable;
        const calorieVariable = data.calorieVariable;

        fetch('/api/goalProgress/waterProgress/exerciseProgress/calorieProgress')
        .then(response => response.json())
        .then(data => {
            const waterProgress = data.waterProgress;
            const exerciseProgress = data.exerciseProgress;
            const calorieProgress = data.calorieProgress;
    



    const waterGoal = waterVariable;
    const waterDrank = waterProgress;
    const waterLeft = waterGoal - waterDrank;
    
    let cw = document.getElementById("waterchart").getContext("2d"); 
    var waterChart = new Chart(cw, {
        type: "doughnut",
        data: {
            labels: ["Water Drank", "Water Remaining"],
            datasets: [
                {
                    label: "Water Goal",
                    data: [waterDrank, waterLeft],
                    backgroundColor: ["blue", "gray"],
                    borderColor: ["black", "black"],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: false,
            },
            animation: {
                duration: 70000,
            }
    });
    
    const exerciseGoal = exerciseVariable;
    const exerciseDone = exerciseProgress;
    const exerciseLeft = exerciseGoal - exerciseDone;
    
    let ce = document.getElementById("echart").getContext("2d");
    var exerciseChart = new Chart(ce, {
        type: "doughnut",
        data: {
            labels: ["Exercise Done", "Exercise Remaining"],
            datasets: [
                {
                    label: "Exercise Goal",
                    data: [exerciseDone, exerciseLeft],
                    backgroundColor: ['rgb(255,179,0)', "gray"],
                    borderColor: ["black", "black"],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: false,
            },
            animation: {
                duration: 70000,
            }
    });
    
    const calorieGoal = Math.round(calorieVariable);
    const calorieDone = calorieProgress;
    const calorieLeft = calorieGoal - calorieDone;
    
    let cc = document.getElementById("foodchart").getContext("2d");
    var calorieChart = new Chart(cc, {
        type: "doughnut",
        data: {
            labels: ["Calories Eaten", "Calories Remaining"],
            datasets: [
                {
                    label: "Calorie Goal",
                    data: [calorieDone, calorieLeft],
                    backgroundColor: ["green", "gray"],
                    borderColor: ["black", "black"],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: false,
            },
            animation: {
                duration: 70000,
            }
    });
})
    })

    });
