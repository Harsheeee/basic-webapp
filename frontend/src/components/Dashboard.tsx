import React from 'react'
import { useState, useEffect } from 'react'
import type { Todo } from '../types'
import axios from 'axios'
import EditTodo from './EditTodo'
import {useNavigate } from 'react-router-dom'


const Dashboard: React.FC = () =>{
  const [todos, setTodos ]= useState<Todo[]>([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [done, setDone] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [todoUpdated, setIsTodoUpdated]=useState(false);

  const username = localStorage.getItem("username") || "";
  const url = `http://localhost:8000/todos?username=${username}`;
  const navigate = useNavigate()

  useEffect(() => {
  if (localStorage.getItem("token") == null) {
    navigate("/");
  }
  }, [navigate]);


  const createTodo = async (todo:{})=>{
    try{
      await axios.post(`http://localhost:8000/create`,todo)
      setIsTodoUpdated(!todoUpdated)

    }
    catch(error){
      alert("Couldn't create todo")
    }
  }

  const editTodo = async (id: Todo['id'], username: Todo['username'], title: Todo['title'], description: Todo['description'],done: Todo['done'], deadline:Todo['deadline'])=>{
    try{
      await axios.put(`http://localhost:8000/update?id=${id}`,{
        title: title,
        username: username,
        description: description,
        done: done,
        deadline: deadline
      })
      setIsTodoUpdated(!todoUpdated)

    }
    catch(err){
      alert("Couldn't update todo")
    }
  }

  const deleteTodo = async (id: Todo['id'])=>{
    try{
      await axios.delete(`http://localhost:8000/delete?id=${id}`)
      setIsTodoUpdated(!todoUpdated)

    }
    catch(err){
      alert("Couldn't delete todo")
    }
  }

  useEffect(()=>{
    const fetchTodos = async ()=>{
      try{
        const response = await axios.get(url);
        setTodos(response.data);
      }catch (err){
        console.error(err)
      }
    };
    fetchTodos();
  },[todoUpdated]);

  return(
<>
  <div className='text-white'>
    <div className="flex justify-between items-center">
    <h1 className='text-black'>{username}'s Todos</h1>
    <button 
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            navigate("/");
          }} 
          className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg focus:outline-none"
        >
          Exit
    </button>
    </div>
    <div id="todo-form" className="max-w-4xl mx-auto mt-10 p-6 bg-customBlack rounded-xl shadow-md text-white">
      <form id="task-form" className="flex flex-wrap items-center justify-between gap-6"
      onSubmit={(e)=>{
        e.preventDefault();
        if(!title.trim() || !description.trim() || !deadline.trim()){
          alert("Please fill in all fields.")
          return;
        }
        createTodo({
          username,
          title,
          description,
          done,
          deadline
        });
        setTitle('');
        setDescription('');
        setDone(false);
        setDeadline('');
      }}>
        <div className="flex items-center gap-2 w-full md:w-[45%]">
          <label htmlFor="title" className="whitespace-nowrap">Task Title:</label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            placeholder="Enter task title"
            onChange={(e) => setTitle(e.target.value)} 
            required 
            className="flex-1 bg-zinc-800 border border-gray-400 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-[45%]">
          <label htmlFor="description" className="whitespace-nowrap">Description:</label>
          <input 
            id="description" 
            name="description" 
            placeholder="Enter task description"
            onChange={(e) => setDescription(e.target.value)} 
            required 
            className="flex-1 bg-zinc-800 border border-gray-400 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-[45%]">
          <label htmlFor="done" className="whitespace-nowrap">Task Completed:</label>
          <input 
            type="checkbox" 
            id="done" 
            name="done" 
            onChange={(e) => setDone(e.target.checked)}
            className="w-5 h-5 text-blue-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-[45%]">
          <label htmlFor="deadline" className="whitespace-nowrap">Deadline:</label>
          <input 
            type="text" 
            id="deadline" 
            name="deadline" 
            placeholder="Enter task deadline"
            onChange={(e) => setDeadline(e.target.value)} 
            required 
            className="flex-1 bg-zinc-800 border border-gray-400 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-full flex justify-center mt-4">
          <button 
            id="input-button" 
            type="submit" 
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  </div>
  <div className='text-white'>
    {todos && todos.length>0?(
  <ul>
  {todos.map(todo => (
    <li key={todo.id} className="flex justify-between items-center mb-4 p-4 border border-gray-300 rounded-lg shadow-sm">
      <div>
        <h3 className="text-lg font-semibold">{todo.title}</h3>
        <p className="text-sm text-gray-600">{todo.description}</p>
        <p className="text-sm">
          Status: <span className={todo.done ? "text-green-500" : "text-red-500"}>{todo.done ? "✔️ Completed" : "❌ Not Completed"}</span>
        </p>
        <p className="text-sm text-gray-500">Deadline: {todo.deadline}</p>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => editTodo(todo.id, todo.username, todo.title, todo.description, !todo.done, todo.deadline)} 
          className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg focus:outline-none"
        >
          {todo.done ? "Mark as Pending" : "Mark as Done"}
        </button>
        <EditTodo todo={todo} onEdited={()=> setIsTodoUpdated(!todoUpdated)}/>
        <button 
          onClick={() => deleteTodo(todo.id)}
          className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg focus:outline-none"
        >
          Delete
        </button>
      </div>
    </li>
  ))}
</ul>
    ):(<p>NO TODOS</p>)}
  </div>
</>
  )
};
export default Dashboard;