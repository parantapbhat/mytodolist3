class TodoStore {
    constructor() {
        this.todos = [];
        this.currentId = 1;
    }

    getAllTodos() {
        return this.todos;
    }

    addTodo(text) {
        const todo = {
            id: this.currentId++,
            text,
            completed: false,
            createdAt: new Date()
        };
        this.todos.push(todo);
        return todo;
    }

    updateTodo(id, updates) {
        const todo = this.todos.find(t => t.id === parseInt(id));
        if (!todo) return null;
        
        Object.assign(todo, updates);
        return todo;
    }

    deleteTodo(id) {
        const index = this.todos.findIndex(t => t.id === parseInt(id));
        if (index === -1) return false;
        
        this.todos.splice(index, 1);
        return true;
    }
}

module.exports = new TodoStore();