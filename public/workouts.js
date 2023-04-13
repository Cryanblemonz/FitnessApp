const showWorkoutsBtn = document.querySelector("#showWorkoutsBtn");
const exerciseList = document.querySelector("#exerciseList");

showWorkoutsBtn.addEventListener('click', function(){
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
                                const p = document.createElement('p');
                                p.textContent = exercise;
                                exerciseList.appendChild(p);
                        }
                })
                .catch(error => console.error(error));
        }
})