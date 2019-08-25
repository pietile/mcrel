import React, { useRef } from 'react';

import { store } from '../store';

let id = 0;

function AddTodo(): JSX.Element {
  const input = useRef<HTMLInputElement>(null);

  return (
    <div>
      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          if (!input.current) {
            return;
          }

          const text = input.current.value.trim();
          if (!text) {
            return;
          }

          store.setState(({ todos }) => ({
            todos: [...todos, { id: ++id, text, completed: false }],
          }));

          input.current.value = '';
        }}
      >
        <input ref={input} />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
}

export default AddTodo;
