import React from 'react';
import { Link } from 'react-router-dom';

const StateSidebar = () => {
    return (
        <aside className="fixed top-0 left-0 bg-blue-50 min-h-screen p-6 w-64 md:block md:relative z-50">
            <ul className="space-y-3">
                <li>
                    <Link to="/state" className="hover:text-blue-700 cursor-pointer font-semibold text-lg">
                        Overview
                    </Link>
                </li>
                <li>
                    <Link to="/state/stateBeneficiary" className="hover:text-blue-700 cursor-pointer font-semibold text-lg">
                        Beneficiaries
                    </Link>
                </li>
                <li>
                    <Link to="/state/stateFund" className="hover:text-blue-700 cursor-pointer font-semibold text-lg">
                        Funds
                    </Link>
                </li>
                <li>
                    <Link to="/state/stateTraining" className="hover:text-blue-700 cursor-pointer font-semibold text-lg">
                        Training
                    </Link>
                </li>
                <li>
                    <Link to="/audit-logs" className="hover:text-blue-700 cursor-pointer font-semibold text-lg">
                        Audit Logs
                    </Link>
                </li>
            </ul>
        </aside>
    );
};

export default StateSidebar;
