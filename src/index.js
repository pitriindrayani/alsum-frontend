import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContextProvider } from './context/userContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ProSidebarProvider } from 'react-pro-sidebar';

// favicon
import Favicon from './assets/ysb/logo-ysb.png';
const favicon = document.getElementById('idFavicon');
favicon.setAttribute('href', Favicon);
const client = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <UserContextProvider>
      <QueryClientProvider client={client}>
        <Router>
          <ProSidebarProvider>
            <App/>
          </ProSidebarProvider>
        </Router>
      </QueryClientProvider>
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


