
$(function() {
    // listen for form submission
    $("#dynamicExercises").on("submit", function(e) {
        e.preventDefault();
        // get selected muscle
        var muscle = $("#muscle").val();
        // send POST request to server
        $.ajax({
            url: "/showWorkouts",
            method: "POST",
            data: { muscle: muscle },
            success: function(response) {
                // update exercise list with results
                var exercises = response.exercises;
                var html = "";
                for (var i = 0; i < exercises.length; i++) {
                    html += "<label><input type='radio' name='exercise' value='" + exercises[i] + "'> " + exercises[i] + "</label><br>   ";
                }
                $("#exerciseList").html(html);
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    });
});

let list = document.getElementsByName('exercise');
let button = document.getElementById('testButton');
let arr = [];

button.addEventListener('click', function(){
        for(i=0; i < list.length; i++){
                if(list[i].checked){
                        console.log(list[i].value);
                        arr.push(list[i].value);
                        // console.log(arr);
                }
        }
        fetch('/test', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ arr: arr })
          })
           
})

