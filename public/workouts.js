$(function () {
    $("#dynamicExercises").on("submit", function (e) {
        e.preventDefault();
        let muscle = $("#muscle").val();
        $.ajax({
            url: "/showWorkouts",
            method: "POST",
            data: { muscle: muscle },
            success: function (response) {
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
                html +=
                    "Add a Custom Exercise " +
                    "<label><input type='text' name='customExercise' class='exercise-checkbox'></label>";
                $("#exerciseList").html(html);
            },
            error: function (xhr, status, error) {
                console.error(error);
            },
        });
    });
});

let list = document.getElementsByName("exercise");
let button = document.getElementById("queueButton");
let arr = [];

button.addEventListener("click", function (e) {
    e.preventDefault();
    let selectedExercises = [];
    $('input[name="exercise"]:checked').each(function () {
        selectedExercises.push($(this).val());
    });
    let customExercise = $('input[name="customExercise"]').val().trim();
    if (customExercise !== "") {
        selectedExercises.push(customExercise);
    }
    $.ajax({
        url: "/queue",
        method: "POST",
        data: { selectedExercises: selectedExercises },
        success: function (response) {
            let queue = $("#exerciseQueue");
            for (let i = 0; i < selectedExercises.length; i++) {
                let exercise = selectedExercises[i];
                if (!queue.find("." + exercise).length) {
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
