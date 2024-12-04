import React, { useEffect, useState } from 'react';
import { fetchTasks, addTask, updateTask, deleteTask } from '../api';

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const loadTasks = async () => {
      const { data } = await fetchTasks();
      setTasks(data);
    };
    loadTasks();
  }, []);

  const handleAddTask = async () => {
    const { data } = await addTask({ description: newTask });
    setTasks([...tasks, data]);
    setNewTask('');
  };

  const handleToggleComplete = async (id, completed) => {
    await updateTask(id, { completed: !completed });
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !completed } : task));
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div>
      <h1>To-Do List</h1>
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task"
        />
        <button onClick={handleAddTask}>Add</button>
      </div>
      <div>
        <h2>Pending Tasks</h2>
        {tasks.filter(task => !task.completed).map(task => (
          <div key={task.id}>
            <span>{task.description}</span>
            <button onClick={() => handleToggleComplete(task.id, task.completed)}>Complete</button>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </div>
        ))}
      </div>
      <div>
        <h2>Completed Tasks</h2>
        {tasks.filter(task => task.completed).map(task => (
          <div key={task.id}>
            <span>{task.description}</span>
            <button onClick={() => handleToggleComplete(task.id, task.completed)}>Undo</button>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoList;
