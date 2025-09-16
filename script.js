const taskInput = document.getElementById('task-input');
const categorySelect = document.getElementById('category-select');
const addButton = document.getElementById('add-button');
const clearButton = document.getElementById('clear-button');

const categories = ['Estetica', 'Motore', 'Ricambi', 'Carrozzeria'];

// Stato app in Map<string, array task>
let tasksMap = new Map();
categories.forEach(cat => tasksMap.set(cat, []));

function render() {
  categories.forEach(category => {
    const ul = document.querySelector(`.category-col[data-category="${category}"] ul`);
    ul.innerHTML = '';

    // Ordino per completamento: incompleti prima
    const sortedTasks = tasksMap.get(category).slice().sort((a, b) => a.completed - b.completed);

    for (const task of sortedTasks) {
      const li = document.createElement('li');
      li.classList.add('added');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('click', () => toggleDone(category, task.id));

      const span = document.createElement('span');
      span.textContent = task.text;

      if (task.completed) {
        span.style.textDecoration = 'line-through';
        span.style.color = '#10b981';
      }

      const removeBtn = document.createElement('button');
      removeBtn.textContent = '×';
      removeBtn.className = 'remove-button';
      removeBtn.title = 'Rimuovi task';
      removeBtn.addEventListener('click', () => removeTask(category, task.id, li));

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(removeBtn);

      ul.appendChild(li);
    }
  });
}

function addTask() {
  const text = taskInput.value.trim();
  const category = categorySelect.value;

  if (!text) {
    alert('Inserisci una descrizione della task.');
    return;
  }
  if (!categories.includes(category)) {
    alert('Seleziona una categoria valida.');
    return;
  }

  const id = Date.now().toString();
  const newTask = { id, text, completed: false };

  tasksMap.get(category).push(newTask);

  taskInput.value = '';
  categorySelect.value = '';

  render();
  taskInput.focus();
}

function toggleDone(category, id) {
  const taskArr = tasksMap.get(category);
  const task = taskArr.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    render();
  }
}

function removeTask(category, id, listItem) {
  // Animazione rimozione prima di togliere
  listItem.classList.add('removed');
  listItem.style.pointerEvents = 'none';

  setTimeout(() => {
    const taskArr = tasksMap.get(category);
    tasksMap.set(category, taskArr.filter(t => t.id !== id));
    render();
  }, 300);
}

function clearAll() {
  if (confirm('Sei sicuro di voler cancellare tutte le attività?')) {
    categories.forEach(cat => tasksMap.set(cat, []));
    render();
  }
}

// Event listeners
addButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTask();
});
clearButton.addEventListener('click', clearAll);

// Inizializzo render
render();
