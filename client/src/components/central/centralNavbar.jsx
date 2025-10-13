import React from 'react';

const CentralNavbar = () => {
    const time = new Date();
    return (
        <div>
            <nav className="w-full bg-[#0B3D91] text-white shadow-md p-6 flex justify-between items-center fixed top-0 z-50">
                {/* Left Section */}
                <div className="flex items-center gap-3">
                    <img
                        src="https://pmajay.dosje.gov.in/public/latest/images/logo.png"
                        alt="Logo"
                        className="h-10 w-10"
                    />
                    <h1 className="text-lg font-semibold tracking-wide">
                        SUJHAA – Central Dashboard
                    </h1>
                </div>

                <div className="hidden md:flex items-center bg-white/10 rounded-xl px-3 py-1">
                    <input
                        type="text"
                        placeholder="Search reports, states..."
                        className="bg-transparent text-sm text-white placeholder-white/80 outline-none w-64 px-1 py-2"
                    />
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-6">
                    <span className="text-sm text-gray-200">
                        {time.toLocaleString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                        })}
                    </span>
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-3 py-1 rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                            CO
                        </div>
                        <span className="text-sm">Central Officer</span>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default CentralNavbar;