$(function () {
    // listen for form submission
    $("#dynamicExercises").on("submit", function (e) {
        e.preventDefault();
        // get selected muscle
        let muscle = $("#muscle").val();
        // send POST request to server
        $.ajax({
            url: "/showWorkouts",
            method: "POST",
            data: { muscle: muscle },
            success: function (response) {
                // update exercise list with results
                let exercises = response.exercises;
                let html = "";
                for (let i = 0; i < exercises.length; i++) {
                    html +=
                        "<label><input type='checkbox' name='exercise' class='exercise-checkbox' value='" +
                        exercises[i] +
                        "'> " +
                        exercises[i] +
                        "</label><br>   ";
                }
                $("#exerciseList").html(html);
            },
            error: function (xhr, status, error) {
                console.error(error);
            },
        });
    });
});

// let showButton = document.getElementById('showWorkoutsBtn');
let list = document.getElementsByName("exercise");
let button = document.getElementById("queueButton");
let arr = [];

// showButton.addEventListener('click', function(){
//     button.classList.remove('collapsed-div');
// })

button.addEventListener("click", function (e) {
    e.preventDefault();
    // get selected exercises
    let selectedExercises = [];
    $('input[name="exercise"]:checked').each(function () {
        selectedExercises.push($(this).val());
    });
    // send POST request to server to push selected exercises to server-side array
    $.ajax({
        url: "/queue",
        method: "POST",
        data: { selectedExercises: selectedExercises },
        success: function (response) {
            console.log("Selected exercises pushed to server-side array.");
            console.log(selectedExercises);
            // update exercise queue with selected exercises
            let queue = $("#exerciseQueue");
            for (let i = 0; i < selectedExercises.length; i++) {
                let exercise = selectedExercises[i];
                if (!queue.find("." + exercise).length) {
                    // only add exercise if it hasn't already been added
                    queue.append(
                        "<li class ='queue-block'> <p> " +
                            exercise +
                            " </p></li>"
                    );
                }
            }
        },
        error: function (xhr, status, error) {
            console.error(error);
        },
    });
});
