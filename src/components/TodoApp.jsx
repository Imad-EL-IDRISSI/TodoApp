import React, { useEffect, useState, useRef } from 'react';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");
  const [editTask, setEditTask] = useState(null);
  const inputRef = useRef(null);

  const fetchTodos = async () => {
    try {
      const response = await fetch('https://daza935pb1.execute-api.us-east-1.amazonaws.com/Todo/');
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      console.log("response", data); // Log the parsed JSON data
      if (data.items && Array.isArray(data.items)) {
        setTodos(data.items); // Update todos based on the response
      } else {
        console.error('Invalid data format:', data);
      }
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://lkdpqogzpa.execute-api.us-east-1.amazonaws.com/Todo/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      // Remove the deleted todo from the state
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleCheckChange = async (todo) => {
    const updatedTodo = { ...todo, done: !todo.done };
    try {
      const response = await fetch(`https://chm8gifsj5.execute-api.us-east-1.amazonaws.com/Todo/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTodo)
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      // Update the state with the modified todo
      setTodos(prevTodos =>
        prevTodos.map(item => (item.id === todo.id ? { ...item, done: !item.done } : item))
      );
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (todo.trim() === "") return;

    if (editTask) {
      // Update existing task
      const updatedTodo = { ...editTask, name: todo };

      try {
        const response = await fetch(`https://chm8gifsj5.execute-api.us-east-1.amazonaws.com/Todo/${editTask.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTodo),
        });

        if (!response.ok) {
          throw new Error('Failed to update todo');
        }

        setTodos(prevTodos =>
          prevTodos.map(item => (item.id === editTask.id ? updatedTodo : item))
        );

        setEditTask(null);
      } catch (error) {
        console.error('Failed to update todo:', error);
      }
    } else {
      // Add new task
      const newTodo = {
        id: Date.now().toString(),
        name: todo,
        done: false,
      };

      try {
        const response = await fetch('https://9pc390j2re.execute-api.us-east-1.amazonaws.com/Todo/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTodo),
        });

        if (!response.ok) {
          throw new Error('Failed to add todo');
        }

        setTodos([...todos, newTodo]);
      } catch (error) {
        console.error('Failed to add todo:', error);
      }
    }

    setTodo("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-x-3 mt-12 text-center">
        <input
          ref={inputRef}
          type="text"
          className="sm:w-1/3 bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          placeholder="Enter a Todo..."
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <button
          type="submit"
          className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
        >
          {editTask ? "Update Todo" : "Add Todo"}
        </button>
      </form>

      {todos.map(todoitem => (
        <div key={todoitem.id} className='m-5'>
          <ul className="list-none sm:w-4/5 mx-auto">
            <li className="mt-4 flex justify-between items-center bg-zinc-800 px-4 py-2 rounded">
              <div className='flex gap-4'>
                <input
                  checked={todoitem.done}
                  type="checkbox"
                  className="cursor-pointer"
                  onChange={() => handleCheckChange(todoitem)}
                />
                <div className={`text-white sm:text-lg ${todoitem.done && "line-through"}`}>{todoitem.name}</div>
              </div>
              <div className='flex gap-3'>
                <button
                  onClick={() => setEditTask(todoitem)}
                  className="inline-flex ml-1 sm:ml-0 sm:w-12 w-8 h-8 rounded-md text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0 disabled:opacity-50"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(todoitem.id)}
                  className="text-white bg-red-500 border-0 py-1 px-4 focus:outline-none hover:bg-red-600 rounded text-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TodoApp;
