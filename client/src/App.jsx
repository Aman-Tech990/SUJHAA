import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import BeneficiaryLayout from './roles/Beneficiary/BeneficiaryLayout';
import Login from './auth/Login';

const App = () => {

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <BeneficiaryLayout />
    },
    {
      path: "/register",
      element: <Register />
    },
    {
      path: "/login",
      element: <Login />
    },
  ]);

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;