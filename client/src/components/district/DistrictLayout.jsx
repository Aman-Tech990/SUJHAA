import React from 'react'
import DistrictNavbar from './DistrictNavbar';
import DistrictSidebar from './DistrictSidebar';
import DistrictDashboard from './DistrictDashboard';

const DistrictLayout = () => {
    return (
        <div>
            <DistrictNavbar />
            <div className='flex'>
                <DistrictSidebar />
                <DistrictDashboard />
            </div>
        </div>
    )
}

export default DistrictLayout;