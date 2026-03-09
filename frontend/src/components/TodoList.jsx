import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, Check, LogOut, Plus } from 'lucide-react';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const navigate = useNavigate();

    const fetchTodos = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/todos', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTodos(res.data);
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                handleLogout();
            }
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleAddTodo = async (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/todos',
                { title: newTodo },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTodos([...todos, res.data]);
            setNewTodo('');
        } catch (err) {
            console.error(err);
        }
    };

    const toggleTodo = async (id, completed) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`http://localhost:5000/api/todos/${id}`,
                { completed: !completed },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTodos(todos.map(t => t._id === id ? res.data : t));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteTodo = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/todos/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTodos(todos.filter(t => t._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = {
            month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="todo-container">
            <div className="todo-header">
                <h1 style={{ color: 'white' }}>My Tasks</h1>
                <button onClick={handleLogout} className="icon-btn" title="Logout">
                    <LogOut size={24} />
                </button>
            </div>

            <form onSubmit={handleAddTodo} className="todo-input-wrap">
                <input
                    type="text"
                    className="input-field"
                    placeholder="What needs to be done?"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                />
                <button type="submit" className="btn" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Plus size={20} /> Add
                </button>
            </form>

            <div className="todo-list">
                {todos.length === 0 ? (
                    <p className="text-center" style={{ color: 'var(--text-muted)' }}>No tasks for today. Awesome!</p>
                ) : (
                    todos.map(todo => (
                        <div key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{ cursor: 'pointer', fontWeight: '500' }} onClick={() => toggleTodo(todo._id, todo.completed)}>
                                    {todo.title}
                                </span>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '15px' }}>
                                    <span title="Assigned at">📅 {formatDate(todo.assignedAt)}</span>
                                    {todo.completed && todo.completedAt && (
                                        <span title="Completed at">✅ {formatDate(todo.completedAt)}</span>
                                    )}
                                </div>
                            </div>
                            <div className="todo-actions">
                                <button onClick={() => toggleTodo(todo._id, todo.completed)} className={`icon-btn check`} title={todo.completed ? 'Mark pending' : 'Mark completed'}>
                                    <Check size={20} style={{ color: todo.completed ? 'var(--success)' : 'inherit' }} />
                                </button>
                                <button onClick={() => deleteTodo(todo._id)} className="icon-btn delete" title="Delete task">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TodoList;
