import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import BeneficiaryDashboardLayout from './components/layouts/BeneficiaryDashBoardLayout.jsx';
import BeneficiaryDashboard from './components/beneficiary/BeneficiaryDashboard.jsx';
import NewProject from './components/beneficiary/NewProject.jsx';
import MyApplications from './components/beneficiary/Myapplications.jsx';
import Documents from './components/beneficiary/Documents.jsx';
import SkillTraining from './components/beneficiary/Skilltraining.jsx';
import FundStatus from './components/beneficiary/FundStatus.jsx';
import StateDashboardLayout from './components/layouts/StateDashboardLayout.jsx';

import { Navigate } from "react-router-dom";
import StateDashboard from './components/state/StateDashboard.jsx';
import StateBeneficiary from './components/state/StateBeneficiary.jsx';
import StateFund from './components/state/StateFund.jsx';
import StateTraining from './components/state/StateTraining.jsx';
import DistrictLayout from './components/layouts/DistrictLayout.jsx';
import DistrictDashboard from './components/district/DistrictDashboard.jsx';
import LandingPage from './components/main/LandingPage';
import CentralDashBoard from './components/central/centralDashBoard';
import CentralLayout from './components/layouts/CentralLayout';

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  {
    path: "/beneficiary",
    element: <BeneficiaryDashboardLayout />,
    children: [
      { index: true, element: <BeneficiaryDashboard /> },
      { path: 'newProject', element: <NewProject /> },
      { path: 'beneficiaryApplications', element: <MyApplications /> },
      { path: 'documents', element: <Documents /> },
      { path: 'skillTraining', element: <SkillTraining /> },
      { path: 'fundStatus', element: <FundStatus /> },
    ]
  },
  {
    path: "/district",
    element: <DistrictLayout />,
    children: [
      { index: true, element: <DistrictDashboard /> },
    ]
  },
  {
    path: "/state",
    element: <StateDashboardLayout />,
    children: [
      { index: true, element: <StateDashboard /> },
      { path: "stateBeneficiary", element: <StateBeneficiary /> },
      { path: "stateFund", element: <StateFund /> },
      { path: "stateTraining", element: <StateTraining /> },
    ]
  },
  {
    path: "/central",
    element: <CentralLayout />,
    children: [
      { index: true, element: <CentralDashBoard /> },
    ]
  },
]);


createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
