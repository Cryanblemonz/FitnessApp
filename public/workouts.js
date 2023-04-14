// const showWorkoutsBtn = document.querySelector("#showWorkoutsBtn");
// const exerciseList = document.querySelector("#exerciseList");

// const form = document.querySelector('#dynamicExercises');

// form.addEventListener('submit', function(event) {
//   event.preventDefault();
//   showWorkoutsBtn.addEventListener('click', function(){
//         const muscle = document.querySelector("#muscle").value;
//         if(muscle){
//                 fetch('/showWorkouts', {
//                         method: 'POST',
//                         headers: { 'Content-Type': 'application/json' },
//                         body: JSON.stringify({ muscle: muscle})
//                 })
//                 .then(response => response.json())
//                 .then(data => {
//                         exerciseList.innerHTML = '';
//                         for (let i = 0; i < data.exercises.length; i++){
//                                 const exercise = data.exercises[i];
//                                 const label = document.createElement('label');
//                                 const r = document.createElement('input');
//                                 r.type = 'radio';
//                                 r.name = 'exercise';
//                                 r.value = exercise;
//                                 label.textContent = exercise;
//                                 label.appendChild(r);
//                                 exerciseList.appendChild(label);
//                         }
//                 })
//                 .catch(error => console.error(error));  
//         }
// })

// });

const showWorkoutsBtn = document.querySelector("#showWorkoutsBtn");
const exerciseList = document.querySelector("#exerciseList");

const form = document.querySelector('#dynamicExercises');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  
  const muscle = document.querySelector("#muscle").value;
  if(muscle){
    fetch('/showWorkouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ muscle: muscle})
    })
    .then(response => response.json())
    .then(data => {
      exerciseList.innerHTML = '';
      for (let i = 0; i < data.exercises.length; i++){
        const exercise = data.exercises[i];
        const label = document.createElement('label');
        const r = document.createElement('input');
        r.type = 'radio';
        r.name = 'exercise';    
        r.value = exercise;
        label.textContent = exercise;
        label.appendChild(r);
        exerciseList.appendChild(label);
      }
    })
    .catch(error => console.error(error));  
  }
});

showWorkoutsBtn.addEventListener('click', function(){
  form.submit();
});

