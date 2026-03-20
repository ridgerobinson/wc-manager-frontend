import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App';
import store from './store';

const container = document.getElementById('root');
const root = createRoot(container); // Create a root
root.render(<Provider store={store}><App /></Provider>); // Use the root to render your app
