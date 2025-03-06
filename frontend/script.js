const API_URL = 'http://localhost:3000/api';
let todos = [];
let currentFilter = 'all';

// DOM Elements
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const filterButtons = document.querySelectorAll('.filter-btn');

// API Functions
async function fetchTodos() {
    try {
        const response = await fetch(`${API_URL}/todos`);
        todos = await response.json();
        renderTodos();
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

async function createTodo(text) {
    try {
        const response = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const newTodo = await response.json();
        todos.push(newTodo);
        renderTodos();
    } catch (error) {
        console.error('Error creating todo:', error);
    }
}

async function updateTodo(id, updates) {
    try {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        const updatedTodo = await response.json();
        todos = todos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo);
        renderTodos();
    } catch (error) {
        console.error('Error updating todo:', error);
    }
}

async function deleteTodo(id) {
    try {
        await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' });
        todos = todos.filter(todo => todo.id !== id);
        renderTodos();
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

// UI Functions
function renderTodos() {
    const filteredTodos = filterTodos(todos, currentFilter);
    todoList.innerHTML = filteredTodos
        .map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}">
                <input type="checkbox" 
                       class="todo-checkbox" 
                       ${todo.completed ? 'checked' : ''}
                       onchange="handleToggle(${todo.id})">
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn" onclick="handleDelete(${todo.id})">Delete</button>
            </li>
        `).join('');
}

function filterTodos(todos, filter) {
    switch (filter) {
        case 'active':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        default:
            return todos;
    }
}

// Event Handlers
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
        createTodo(text);
        todoInput.value = '';
    }
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.dataset.filter;
        renderTodos();
    });
});

function handleToggle(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        updateTodo(id, { completed: !todo.completed });
    }
}

function handleDelete(id) {
    deleteTodo(id);
}

// Initial load
fetchTodos();