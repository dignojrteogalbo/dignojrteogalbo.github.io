// State
let todos = JSON.parse(localStorage.getItem('notionWidgetTodos')) || [];
let el = {};

/**
 * Get time remaining until target as { hours, minutes, seconds }
 */
function getTimeUntil(targetTime) {
    const diff = Math.max(0, targetTime - new Date());
    return {
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60)
    };
}

/**
 * Format time object to HH:MM:SS string
 */
function formatTime({ hours, minutes, seconds }) {
    return [hours, minutes, seconds]
        .map(n => String(n).padStart(2, '0'))
        .join(':');
}

/**
 * Get reset time from query param or default to midnight
 */
function getResetTime() {
    const param = new URLSearchParams(window.location.search).get('resetTime');
    if (param) return new Date(param);
    
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    return midnight;
}

/**
 * Update the countdown timer display
 */
function updateTimer() {
    el.countdown.textContent = formatTime(getTimeUntil(getResetTime()));
}

/**
 * Save todos to localStorage
 */
function saveTodos() {
    localStorage.setItem('notionWidgetTodos', JSON.stringify(todos));
}

/**
 * Create a todo item DOM element
 */
function createTodoElement(todo, index) {
    const item = document.createElement('div');
    item.className = `todo-item ${todo.completed ? 'completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => {
        todos[index].completed = !todos[index].completed;
        saveTodos();
        renderTodos();
    });

    const text = document.createElement('div');
    text.className = 'todo-text';
    text.textContent = todo.text;
    text.addEventListener('click', () => {
        const newText = prompt('Edit todo:', todo.text);
        if (newText?.trim()) {
            todos[index].text = newText.trim();
            saveTodos();
            renderTodos();
        }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'todo-delete-btn';
    deleteBtn.addEventListener('click', () => {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
    });

    item.append(checkbox, text, deleteBtn);
    return item;
}

/**
 * Render all todos
 */
function renderTodos() {
    el.todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        el.todoList.appendChild(createTodoElement(todo, index));
    });
}

/**
 * Add a new todo and reset input
 */
function addTodo(text) {
    if (text.trim()) {
        todos.push({ text: text.trim(), completed: false });
        saveTodos();
        renderTodos();
    }
    el.todoInput.value = '';
    toggleInputGroup(false);
}

/**
 * Toggle the input group visibility
 */
function toggleInputGroup(show) {
    el.todoInputGroup.classList.toggle('active', show);
    if (show) el.todoInput.focus();
}

/**
 * Initialize the widget
 */
function init() {
    // Cache DOM elements
    el = {
        countdown: document.getElementById('countdown'),
        todoList: document.getElementById('todoList'),
        addTodoBtn: document.getElementById('addTodoBtn'),
        todoInputGroup: document.getElementById('todoInputGroup'),
        todoInput: document.getElementById('todoInput'),
        todoConfirmBtn: document.getElementById('todoConfirmBtn'),
        todoCancelBtn: document.getElementById('todoCancelBtn')
    };

    // Start timer
    updateTimer();
    setInterval(updateTimer, 1000);

    // Render todos
    renderTodos();

    // Setup event listeners
    el.addTodoBtn.addEventListener('click', () => toggleInputGroup(true));
    el.todoConfirmBtn.addEventListener('click', () => addTodo(el.todoInput.value));
    el.todoCancelBtn.addEventListener('click', () => toggleInputGroup(false));
    el.todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo(el.todoInput.value);
    });
}

// Start when DOM is ready
document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
