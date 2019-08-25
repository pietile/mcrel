import React from 'react';

import { Store } from '../Store';

export const Context = React.createContext<Store<any, any>>(new Store({}));
