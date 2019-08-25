import { Store } from 'mcrel';

export interface ToDo {
  id: number;
  text: string;
  completed: boolean;
}

export type Filter = 'SHOW_ALL' | 'SHOW_COMPLETED' | 'SHOW_ACTIVE';

export interface StoreState {
  todos: ToDo[];
  visibilityFilter: Filter;
}

export const store = new Store<StoreState>({
  todos: [],
  visibilityFilter: 'SHOW_ALL',
});
