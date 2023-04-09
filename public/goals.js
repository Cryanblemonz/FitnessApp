document.addEventListener("DOMContentLoaded", function () {
    document
        .querySelector("#changeCaloriesShow")
        .addEventListener("click", function () {
            document
                .querySelector("#changeCalories")
                .classList.toggle("collapsed-div");
        });
});

document.addEventListener("DOMContentLoaded", function () {
    document
        .querySelector("#changeExerciseShow")
        .addEventListener("click", function () {
            document
                .querySelector("#changeExercise")
                .classList.toggle("collapsed-div");
        });
});

document.addEventListener("DOMContentLoaded", function () {
  document
      .querySelector("#changeWaterShow")
      .addEventListener("click", function () {
          document
              .querySelector("#changeWater")
              .classList.toggle("collapsed-div");
      });
});