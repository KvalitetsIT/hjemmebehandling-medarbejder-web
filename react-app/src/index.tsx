import { createRoot } from 'react-dom/client';
import MyApp from './pages/_app';
import React from 'react';


const root = createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <MyApp />
);





// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
