const express = require('express');
const cors = require('cors');
const path = require('path');
const todoStore = require('./todoStore');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Get all todos
app.get('/api/todos', (req, res) => {
    res.json(todoStore.getAllTodos());
});

// Create a new todo
app.post('/api/todos', (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }
    const todo = todoStore.addTodo(text);
    res.status(201).json(todo);
});

// Update a todo
app.put('/api/todos/:id', (req, res) => {
    const todo = todoStore.updateTodo(req.params.id, req.body);
    if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
});

// Delete a todo
app.delete('/api/todos/:id', (req, res) => {
    const deleted = todoStore.deleteTodo(req.params.id);
    if (!deleted) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});