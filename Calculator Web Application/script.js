const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const clearBtn = document.getElementById('clear');
const equalsBtn = document.getElementById('equals');
const historyList = document.getElementById('history');
const themeToggle = document.getElementById('theme-toggle');

// Memory buttons
const mcBtn = document.getElementById('mc');
const mrBtn = document.getElementById('mr');
const mplusBtn = document.getElementById('mplus');
const mminusBtn = document.getElementById('mminus');

let currentInput = '';
let error = false;
let history = [];
let memory = 0;

// Update display
function updateDisplay() {
  display.value = error ? 'Error' : currentInput;
}

// Add to history
function addToHistory(expression, result) {
  history.unshift(`${expression} = ${result}`);
  if (history.length > 10) history.pop();
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = '';
  history.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    historyList.appendChild(li);
  });
}

// Append value to input
function appendValue(value) {
  if (error) {
    currentInput = '';
    error = false;
  }
  if (value === '√') {
    currentInput += 'Math.sqrt(';
  } else if (value === '%') {
    currentInput += '/100';
  } else {
    currentInput += value;
  }
  updateDisplay();
}

// Clear display
function clearDisplay() {
  currentInput = '';
  error = false;
  updateDisplay();
}

// Calculate result
function calculateResult() {
  try {
    // Prevent security issues
    if (/[^0-9+\-*/().Mathsqrt]/.test(currentInput.replace(/Math\.sqrt/g, ''))) throw new Error('Invalid input');
    // Replace Math.sqrt( with Math.sqrt(
    let expression = currentInput.replace(/Math\.sqrt/g, 'Math.sqrt');
    let result = eval(expression);
    if (result === Infinity || isNaN(result)) throw new Error('Math Error');
    addToHistory(currentInput, result);
    currentInput = result.toString();
  } catch {
    currentInput = '';
    error = true;
  }
  updateDisplay();
}

// Button click handling
buttons.forEach(btn => {
  if (btn.dataset.value) {
    btn.addEventListener('click', () => appendValue(btn.dataset.value));
  }
});

clearBtn.addEventListener('click', clearDisplay);
equalsBtn.addEventListener('click', calculateResult);

// Keyboard input handling
document.addEventListener('keydown', (e) => {
  if ((e.key >= '0' && e.key <= '9') || ['+', '-', '*', '/', '.', '(', ')'].includes(e.key)) {
    appendValue(e.key);
  } else if (e.key === 'Enter' || e.key === '=') {
    calculateResult();
  } else if (e.key === 'Backspace') {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
  } else if (e.key.toLowerCase() === 'c') {
    clearDisplay();
  }
});

// Memory functions
mcBtn.onclick = () => { memory = 0; };
mrBtn.onclick = () => { 
  currentInput += memory.toString(); 
  updateDisplay(); 
};
mplusBtn.onclick = () => {
  memory += Number(currentInput) || 0;
};
mminusBtn.onclick = () => {
  memory -= Number(currentInput) || 0;
};

// Theme toggle
themeToggle.onclick = () => {
  document.body.classList.toggle('light-mode');
};
