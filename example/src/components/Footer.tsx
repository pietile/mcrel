import React from 'react';

import FilterButton from './FilterButton';

function Footer(): JSX.Element {
  return (
    <div>
      <span>Show: </span>
      <FilterButton value="SHOW_ALL">All</FilterButton>
      <FilterButton value="SHOW_ACTIVE">Active</FilterButton>
      <FilterButton value="SHOW_COMPLETED">Completed</FilterButton>
    </div>
  );
}

export default Footer;
