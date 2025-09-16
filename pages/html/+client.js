let count = 0;

const counterElement = document.getElementById('counter-value');
const decrementBtn = document.getElementById('decrement-button');
const incrementBtn = document.getElementById('increment-button');

const updateDisplay = () => {
  counterElement.textContent = count.toString();
};

decrementBtn.addEventListener('click', () => {
  count--;
  updateDisplay();
});

incrementBtn.addEventListener('click', () => {
  count++;
  updateDisplay();
});
