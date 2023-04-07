document.addEventListener("DOMContentLoaded", function () {
    document
        .querySelector("#changeCaloriesShow")
        .addEventListener("click", function () {
            document
                .querySelector("#changeCalories")
                .classList.toggle("collapsedDiv");
        });
});

document.addEventListener("DOMContentLoaded", function () {
    document
        .querySelector("#changeExerciseShow")
        .addEventListener("click", function () {
            document
                .querySelector("#changeExercise")
                .classList.toggle("collapsedDiv");
        });
});

document.addEventListener("DOMContentLoaded", function () {
  document
      .querySelector("#changeWaterShow")
      .addEventListener("click", function () {
          document
              .querySelector("#changeWater")
              .classList.toggle("collapsedDiv");
      });
});