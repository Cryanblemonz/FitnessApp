
$(document).ready(function() {
        function updateSelectedExercises() {
          selectedExercises = [];
          $("#exerciseQueue input[type=checkbox]:checked").each(function() {
            selectedExercises.push($(this).val());
          });
        }
      
        $("#exerciseQueue").on("change", "input[type=checkbox]", function() {
          updateSelectedExercises();
        });
      
        $("#testButton").click(function(event) {
          event.preventDefault();
          updateSelectedExercises();
          $.ajax({
                type: "POST",
                url: "/test",
                data: { selectedExercises: selectedExercises },
                success: function(response) {
                  $("#workoutBuilder ul").empty();

                  $.each(response.exercises, function(index, exercise) {
                    $("#workoutBuilder ul").append("<li><p>" + exercise + "</p></li>");
                  });
                }
              })
        })
})
