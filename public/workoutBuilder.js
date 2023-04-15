
$(document).ready(function() {
        // Function to update the selected exercises array when checkboxes are checked
        function updateSelectedExercises() {
          selectedExercises = [];
          $("#exerciseQueue input[type=checkbox]:checked").each(function() {
            selectedExercises.push($(this).val());
          });
        }
      
        // Update the selected exercises array when a checkbox is checked or unchecked
        $("#exerciseQueue").on("change", "input[type=checkbox]", function() {
          updateSelectedExercises();
        });
      
        // Submit the form when the "Test" button is clicked
        $("#testButton").click(function(event) {
          event.preventDefault();
          updateSelectedExercises();
          $.ajax({
                type: "POST",
                url: "/test",
                data: { selectedExercises: selectedExercises },
                success: function(response) {
                  // Clear the existing list
                  $("#workoutBuilder ul").empty();
              
                  // Add each exercise in the updated array to the list
                  $.each(response.exercises, function(index, exercise) {
                    $("#workoutBuilder ul").append("<li><p>" + exercise + "</p></li>");
                  });
                }
              })
        })
})
