/*
 * index.js
 * App bootstrap and route definitions. Wraps the app in `QueryClientProvider` for react-query usage.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import Documents from './Pages/Documents';
import Home from './Pages/Home';
import Reader from './Pages/Reader';
import './index.css';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<App currentPageName="Home"><Home /></App>} />
          <Route path="/documents" element={<App currentPageName="Documents"><Documents /></App>} />
          <Route path="/reader" element={<App currentPageName="Reader"><Reader /></App>} />
          <Route path="*" element={<App currentPageName="Home"><Home /></App>} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);

