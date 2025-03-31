// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Nav } from './components/Nav';

import { Provider } from 'react-redux';
import store from "./app/store/store"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<Provider store={store}>
  <Nav />
</Provider>
);