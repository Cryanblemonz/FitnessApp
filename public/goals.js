document.addEventListener('DOMContentLoaded', function(){
        document.querySelector('#changeCaloriesShow').addEventListener("click", function () {
          console.log("Button clicked");
          document.querySelector('#changeCalories').classList.toggle("collapsedd");
        })
        
      })
    