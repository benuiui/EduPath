import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="1026251583322-qudndc6qqletg7nme9hc047pbrbkne0r.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
