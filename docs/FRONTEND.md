# Frontend Documentation

## Architecture Overview

```mermaid
graph TD
    A[HTML Entry] --> B[TodoForm]
    A --> C[FilterButtons]
    A --> D[TodoList]
    B --> E[createTodo]
    D --> F[renderTodos]
    F --> G[filterTodos]
    D --> H[handleToggle]
    D --> I[handleDelete]
    E --> J[API Client]
    H --> J
    I --> J
```

## Component Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant S as Store
    
    U->>F: Add Todo
    F->>A: createTodo
    A->>S: addTodo
    S-->>A: Return New Todo
    A-->>F: Response
    F->>F: renderTodos

    U->>F: Toggle Complete
    F->>A: updateTodo
    A->>S: updateTodo
    S-->>A: Updated Todo
    A-->>F: Response
    F->>F: renderTodos
```

## Function Documentation

### API Functions
- `fetchTodos`: Retrieves all todos from the API
- `createTodo`: Sends POST request to create new todo
- `updateTodo`: Updates existing todo status
- `deleteTodo`: Removes todo from the system

### UI Functions
- `renderTodos`: Renders todo list based on current filter
- `filterTodos`: Filters todos by status (all/active/completed)

### Event Handlers
- `handleToggle`: Toggles todo completion status
- `handleDelete`: Triggers todo deletion
- Form submit handler: Creates new todos
- Filter click handler: Updates visible todos

## State Management
The frontend maintains two main states:
1. `todos`: Array of all todo items
2. `currentFilter`: Current active filter selection

## CSS Structure
- Container layout and responsiveness
- Todo item styling and interactions
- Filter button states
- Form input styling
- Accessibility considerations