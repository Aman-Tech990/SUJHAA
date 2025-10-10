import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import DashboardLayout from './components/layouts/DashboardLayout.jsx';
import Dashboard from './components/Dashboard';
import NewProject from './components/NewProject';
import MyApplications from './components/MyApplications';
import Documents from './components/Documents';
import SkillTraining from './components/SkillTraining';
import FundStatus from './components/FundStatus';

const router = createBrowserRouter([
  {
    element: <DashboardLayout />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/NewProject', element: <NewProject /> },
      { path: '/MyApplications', element: <MyApplications /> },
      { path: '/Documents', element: <Documents /> },
      { path: '/SkillTraining', element: <SkillTraining /> },
      { path: '/FundStatus', element: <FundStatus /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
