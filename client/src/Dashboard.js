import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';

function Dashboard() {
  const { username } = useParams();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  
  useEffect(() => {
    // Fetch tasks from the server when the page loads
    Axios.post("http://localhost:5000/getTasks", { username })
      .then((response) => {
        if (response.data.tasks) {
          setTasks(response.data.tasks); // Set tasks received from the server
        }
      });
  }, [username]);

  // Function to handle adding a new task
  const addTask = () => {
    if (newTask) {
      Axios.post("http://localhost:5000/addTask", { username, task_description: newTask, status: "pending" })
        .then(() => {
          // Refresh task list after adding new task
          Axios.post("http://localhost:5000/getTasks", { username })
            .then((response) => {
              if (response.data.tasks) {
                setTasks(response.data.tasks); // Update task list
              }
            });
        });
      setNewTask(""); // Clear the input field
    }
  };

  const completeTask = (taskId) => {
    Axios.post("http://localhost:5000/updateTask", { task_id: taskId, status: "completed" })
      .then(() => {
        // Refresh task list after marking the task as completed
        Axios.post("http://localhost:5000/getTasks", { username })
          .then((response) => {
            if (response.data.tasks) {
              setTasks(response.data.tasks); // Update task list
            }
          });
      });
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
      {/* Left section - Completed Tasks */}
      <div style={{ width: "45%" }}>
        <h2>Completed Tasks</h2>
        <ul>
          {tasks.filter(task => task.status === "completed").map((task) => (
            <li key={task.task_id}>{task.task_description}</li>
          ))}
        </ul>
      </div>

      {/* Right section - Pending Tasks */}
      <div style={{ width: "45%" }}>
        <h2>Pending Tasks</h2>
        <ul>
          {tasks.filter(task => task.status === "pending").map((task) => (
            <li key={task.task_id}>
              {task.task_description}
              <button onClick={() => completeTask(task.task_id)} style={{ marginLeft: "10px" }}>Complete</button>
            </li>
          ))}
        </ul>
        
        <div>
          <h3>Add New Task</h3>
          <input 
            type="text"
            placeholder="Enter task description..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button onClick={addTask}>Add Task</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
