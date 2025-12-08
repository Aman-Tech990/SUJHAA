import React from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';

// Beneficiary
import BeneficiaryLayout from './roles/Beneficiary/BeneficiaryLayout';
import BeneficiaryDashboard from './roles/Beneficiary/BeneficiaryDashboard';
import BeneficiaryForm from './roles/Beneficiary/BeneficiaryForm';
import MySchemes from './roles/Beneficiary/MySchemes';
import BeneficiaryFundDetails from './roles/Beneficiary/BeneficiaryFundDetails';
import BeneficiaryHelp from './roles/Beneficiary/BeneficiaryHelp';
import BeneficiaryTrainingTracker from './roles/Beneficiary/BeneficiaryTrainingTracker';
import BeneficiaryProfile from './roles/Beneficiary/BeneficiaryProfile';

// District Officer
import DistrictLayout from './roles/District/DistrictLayout';
import DistrictDashboard from './roles/District/DistrictDashboard';
import DistrictBeneficiaryForm from './roles/District/DistrictBenificiaryForm';
import DistrictFeedbackAnalysis from './roles/District/DistrictFeedbackAnalysis';
import ProjectProgress from './roles/District/ProjectProgress';

// State Officer
import StateLayout from './roles/State/StateLayout';
import StateDashboard from './roles/State/StateDashboard';
import StateBeneficiary from './roles/State/StateBeneficiary';
import StateFundReport from './roles/State/StateFundReport';
import StateMISReport from './roles/State/StateMISReport';
import StateTrainingReports from './roles/State/StatePerformanceReports';
import StateApplications from './roles/State/StateApplications';
import StateApplicationDetails from './roles/State/StateApplicationDetails';

// Central Officer
import CentralLayout from './roles/Central/CentralLayout';
import CentralDashboard from './roles/Central/CentralDashboard';
import CentralStatePerformance from './roles/Central/CentralStates';
import CentralFundsDisbursement from './roles/Central/CentralFunds';
import CentralBeneficiaryAnalytics from './roles/Central/CentralAnalytics';
import CentralApplications from './roles/Central/CentralApplications';
import CentralBeneficiaryApproval from './roles/Central/CentralBeneficiaryApproval';

// Trainer
import TrainerDashboard from './roles/Trainer/TrainerDashboard';

// Auth
import Register from './auth/Register';
import Login from './auth/Login';

// Landing
import LandingPage from './pages/LandingPage';
import DistrictAssignTraining from './roles/District/DistrictAssignTraining';


// TODO LATER:
// import StateLayout
// import FieldLayout
// import CenterLayout
// import TrainerLayout

const App = () => {

  const appRouter = createBrowserRouter([

    /* PUBLIC ROUTES */
    { path: "/", element: <LandingPage /> },
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },

    /* BENEFICIARY ROUTES */
    {
      path: "/beneficiary",
      element: (
        <ProtectedRoute allowedRoles={["BENEFICIARY"]}>
          <BeneficiaryLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "dashboard", element: <BeneficiaryDashboard /> },
        { index: true, element: <Navigate to="dashboard" replace /> },
        { path: "BeneficiaryForm", element: <BeneficiaryForm /> },
        { path: "myschemes", element: <MySchemes /> },
        { path: "fundDetails", element: <BeneficiaryFundDetails /> },
        { path: "support", element: <BeneficiaryHelp /> },
        { path: "trainingtracker", element: <BeneficiaryTrainingTracker /> },
        { path: "profile", element: <BeneficiaryProfile /> },
      ],
    },

    /* DISTRICT OFFICER ROUTES */
    {
      path: "/districtOfficer",
      element: (
        <ProtectedRoute allowedRoles={["DISTRICT_OFFICER"]}>
          <DistrictLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "dashboard", element: <DistrictDashboard /> },
        { index: true, element: <Navigate to="dashboard" replace /> },
        { path: "projectProgress", element: <ProjectProgress /> },
        { path: "feedbackAnalysis", element: <DistrictFeedbackAnalysis /> },
        { path: "application/:id", element: <DistrictBeneficiaryForm /> },
        { path: "assignTraining", element: <DistrictAssignTraining /> },
      ]
    },
    {
      path: '/stateOfficer',
      element: <StateLayout />,
      children: [
        {
          path: "dashboard",
          element: <StateDashboard />
        },
        {
          index: true,
          element: <Navigate to="dashboard" replace />
        },
        {
          path: "MISreport",
          element: <StateMISReport />
        },
        {
          path: "fundreport",
          element: <StateFundReport />
        },
        {
          path: "beneficiaryreport",
          element: <StateBeneficiary />
        },
        {
          path: "trainingreport",
          element: <StateTrainingReports />
        },
        {
          path: "applications",
          element: <StateApplications />
        },
        {
          path: "application/:refId",
          element: <StateApplicationDetails />
        },
      ]
    },
    {
      path: '/centralOfficer',
      element: <CentralLayout />,
      children: [
        {
          path: "dashboard",
          element: <CentralDashboard />
        },
        {
          index: true,
          element: <Navigate to="dashboard" replace />
        },
        {
          path: "statesPerformance",
          element: <CentralStatePerformance />
        },
        {
          path: "funds",
          element: <CentralFundsDisbursement />
        },

        // you can keep this separate analytics page if you want
        {
          path: "beneficiaryanalytics",
          element: <CentralBeneficiaryAnalytics />
        },

        // NESTED ROUTES FOR APPLICATIONS
        {
          path: "beneficiaryApplications",
          children: [
            {
              index: true,
              element: <CentralApplications />      // Screen 1 – List
            },
            {
              path: ":appId",
              element: <CentralBeneficiaryApproval /> // Screen 2 – Detail + DBT + Training
            }
          ]
        }
      ]
    },
    {
      path: '/trainer',
      element: <TrainerDashboard />
    },
  ]);

  return <RouterProvider router={appRouter} />;
}

export default App;
