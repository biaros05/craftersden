import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { StrictMode } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import ErrorPage from './error-page.jsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    errorElement: <ErrorPage/>
  }
]);

createRoot(document.getElementById('root')).
  render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );