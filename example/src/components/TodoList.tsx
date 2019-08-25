import React from 'react';

import { DeepReadonlyObject, pierce, useMcrelSelector } from 'mcrel';

import { Filter, StoreState, ToDo, store } from '../store';

import Todo from './Todo';

function getVisibleTodos(todos: readonly ToDo[], filter: Filter): readonly ToDo[] {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;

    case 'SHOW_COMPLETED':
      return todos.filter((t: ToDo) => t.completed);

    case 'SHOW_ACTIVE':
      return todos.filter((t: ToDo) => !t.completed);

    default:
      throw new Error(`Unknown filter: ${filter}`);
  }
}

function TodoList(): JSX.Element {
  const { todos, visibilityFilter } = useMcrelSelector(
    (state: DeepReadonlyObject<StoreState>) => state,
  );

  const visibleTodos = getVisibleTodos(todos, visibilityFilter);

  return (
    <ul>
      {visibleTodos.map((todo) => (
        <Todo
          key={todo.id}
          {...todo}
          onClick={() => {
            const index = todos.findIndex(({ id }) => id === todo.id);
            if (index === -1) {
              return;
            }

            store.setState({
              todos: pierce(index, { completed: !todo.completed }),
            });
          }}
        />
      ))}
    </ul>
  );
}

export default TodoList;
