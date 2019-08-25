import React from 'react';

interface Props {
  completed: boolean;
  text: string;
  onClick: () => void;
}

function Todo({ onClick, completed, text }: Props): JSX.Element {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <li
      style={{
        textDecoration: completed ? 'line-through' : 'none',
      }}
      onClick={onClick}
    >
      {text}
    </li>
  );
}

export default Todo;
