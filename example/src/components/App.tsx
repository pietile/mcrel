import React from 'react';

import AddTodo from './AddTodo';
import Footer from './Footer';
import TodoList from './TodoList';

function App(): JSX.Element {
  return (
    <div>
      <AddTodo />
      <TodoList />
      <Footer />
    </div>
  );
}

export default App;
