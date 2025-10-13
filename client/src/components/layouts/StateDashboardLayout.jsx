import React from 'react'
import StateDashboard from '../state/StateDashboard';
import { Outlet } from 'react-router-dom';
import StateSIdebar from '../state/StateSIdebar';
import StateNavbar from '../state/StateNavbar';

const StateDashboardLayout = () => {
    return (
        <div>
            <StateNavbar />
            <div className='flex'>
                <StateSIdebar />
                <Outlet />
            </div>
        </div>
    )
}

export default StateDashboardLayout;