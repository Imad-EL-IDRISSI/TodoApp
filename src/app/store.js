import { configureStore } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

// Redux Slice
const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    todoList: [],
    editedTodo: [],
  },
  reducers: {
    setTodos: (state, action) => {
      state.todoList = action.payload;
    },
    addTodo: (state, action) => {
      state.todoList.push(action.payload);
    },
    deleteTodo: (state, action) => {
      state.todoList = state.todoList.filter(todo => todo.id !== action.payload);
    },
    handleCheck: (state, action) => {
      const todo = state.todoList.find(todo => todo.id === action.payload);
      if (todo) {
        todo.done = !todo.done;
      }
    },
    editTodo: (state, action) => {
      state.editedTodo = state.todoList.filter(todo => todo.id === action.payload);
    },
  },
});

// Export action creators
export const { setTodos, addTodo, deleteTodo, handleCheck, editTodo } = todoSlice.actions;

// Export reducer
export default todoSlice.reducer;

// Create Redux store
export const store = configureStore({
  reducer: {
    todos: todoSlice.reducer,
  },
});
