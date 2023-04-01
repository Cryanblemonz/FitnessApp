const toggleButton = document.querySelector('.toggle-button');
const workouts = document.querySelector('#saved-workouts');
const dashboard = document.querySelector('#dashboard');

toggleButton.addEventListener('click', function() {
  workouts.classList.toggle('collapsed');
  dashboard.classList.toggle('col-lg-9');
  dashboard.classList.toggle('col-lg-12');
  // toggleButton.textContent = collapsible.classList.contains('collapsed') ? '<' : '>';
});

