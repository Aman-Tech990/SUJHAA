import React from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import BeneficiaryLayout from './roles/Beneficiary/BeneficiaryLayout';
import Register from './auth/Register';
import Login from './auth/Login';
import BeneficiaryDashboard from './roles/Beneficiary/BeneficiaryDashboard';
import LandingPage from './pages/LandingPage';
import BeneficiaryForm from './roles/Beneficiary/BeneficiaryForm';
import MySchemes from './roles/Beneficiary/MySchemes';
import BeneficiaryFundDetails from './roles/Beneficiary/BeneficiaryFundDetails';
import BeneficiaryHelp from './roles/Beneficiary/BeneficiaryHelp';
import BeneficiaryTrainingTracker from './roles/Beneficiary/BeneficiaryTrainingTracker';
import DistrictLayout from './roles/District/DistrictLayout';
import DistrictDashboard from './roles/District/DistrictDashboard';
import MISReport from './roles/District/MISReport';
import DistrictBeneficiaryForm from './roles/District/DistrictBenificiaryForm';
import DistrictFeedbackAnalysis from './roles/District/DistrictFeedbackAnalysis';

const App = () => {

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/beneficiary",
      element: <BeneficiaryLayout />,
      children: [
        {
          path: "dashboard",
          element: <BeneficiaryDashboard />
        },
        {
          index: true,
          element: <Navigate to="dashboard" replace />
        },
        {
          path: "BeneficiaryForm",
          element: <BeneficiaryForm />
        },
        {
          path: "myschemes",
          element: <MySchemes />
        },
        {
          path: "fundDetails",
          element: <BeneficiaryFundDetails />
        },
        {
          path: "support",
          element: <BeneficiaryHelp />
        },
        {
          path: "trainingtracker",
          element: <BeneficiaryTrainingTracker />
        },
      ]
    },
    {
      path: "/register",
      element: <Register />
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: '/districtOfficer',
      element: <DistrictLayout />,
      children: [
        {
          path: "dashboard",
          element: <DistrictDashboard />
        },
        {
          index: true,
          element: <Navigate to="dashboard" replace />
        },
        {
          path: "misreport",
          element: <MISReport />
        },
        {
          path: "feedbackAnalysis",
          element: <DistrictFeedbackAnalysis />
        },
        {
          path: "application/:id",
          element: <DistrictBeneficiaryForm />
        }
      ]
    },


  ]);

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;