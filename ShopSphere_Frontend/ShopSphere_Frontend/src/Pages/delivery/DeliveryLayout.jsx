import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useTheme } from "../../context/ThemeContext";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export default function DeliveryLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { isDarkMode, toggleTheme } = useTheme();

    useEffect(() => {
        const handler = (e) => setSidebarOpen(Boolean(e?.detail?.open));
        window.addEventListener('deliverySidebarToggle', handler);
        return () => window.removeEventListener('deliverySidebarToggle', handler);
    }, []);

    return (
        <div className={`min-h-screen flex transition-colors duration-300 overflow-x-hidden ${isDarkMode ? 'bg-[#0f172a] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Header for mobile or for theme toggle if not in sidebar */}
                <header className={`md:hidden h-16 flex items-center justify-between px-4 border-b transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
                    <div className="pl-12">
                        <span className="text-sm font-black uppercase tracking-widest italic">Delivery Portal</span>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-xl transition-all ${isDarkMode ? 'text-amber-400 bg-slate-800' : 'text-indigo-600 bg-slate-50 border border-slate-200'}`}
                    >
                        {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                    </button>
                </header>

                <main
                    className={[
                        'flex-1 transition-all duration-300 min-w-0',
                        'p-4 md:p-8',
                        sidebarOpen ? 'md:ml-64' : 'md:ml-20',
                    ].join(' ')}
                >
                    {/* PC Theme Toggle (Hidden on mobile as it's in the mobile header or sidebar) */}
                    <div className="hidden md:flex justify-end mb-6">
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-xl border transition-all duration-300 flex items-center gap-3 group ${isDarkMode
                                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:border-amber-400/50'
                                : 'bg-white border-slate-200 text-indigo-600 hover:border-indigo-300 shadow-sm'}`}
                        >
                            {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                            <span className="text-[10px] font-black uppercase tracking-widest">{isDarkMode ? 'Light' : 'Dark'}</span>
                        </button>
                    </div>

                    <Outlet />
                </main>
            </div>
        </div>
    );
}
