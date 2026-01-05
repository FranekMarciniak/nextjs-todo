import { useState, useEffect } from 'react';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const res = await fetch('/api/todos');
    const data = await res.json();
    setTodos(data);
    setLoading(false);
  }

  async function addTodo(e) {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTodo }),
    });
    const todo = await res.json();
    setTodos([todo, ...todos]);
    setNewTodo('');
  }

  async function toggleTodo(id, completed) {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    });
    const updated = await res.json();
    setTodos(todos.map(t => t.id === id ? updated : t));
  }

  async function deleteTodo(id) {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    setTodos(todos.filter(t => t.id !== id));
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📝 Todo App</h1>
      <p style={styles.subtitle}>Deployed with SnapDeploy</p>

      <form onSubmit={addTodo} style={styles.form}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          style={styles.input}
        />
        <button type="submit" style={styles.addButton}>Add</button>
      </form>

      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : (
        <ul style={styles.list}>
          {todos.map((todo) => (
            <li key={todo.id} style={styles.item}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, todo.completed)}
                style={styles.checkbox}
              />
              <span style={{
                ...styles.text,
                textDecoration: todo.completed ? 'line-through' : 'none',
                opacity: todo.completed ? 0.6 : 1,
              }}>
                {todo.title}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={styles.deleteButton}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {!loading && todos.length === 0 && (
        <p style={styles.empty}>No todos yet. Add one above!</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '50px auto',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '5px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#888',
    fontSize: '14px',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
  },
  addButton: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#4F46E5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '8px',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    marginRight: '12px',
    cursor: 'pointer',
  },
  text: {
    flex: 1,
    fontSize: '16px',
  },
  deleteButton: {
    width: '30px',
    height: '30px',
    fontSize: '20px',
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    lineHeight: '1',
  },
  loading: {
    textAlign: 'center',
    color: '#888',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
  },
};

