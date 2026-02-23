import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
    PanelLeftClose,
    PanelLeftOpen,
    ClipboardList,
    Search,
    Filter,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Package,
    ArrowUpRight,
    Hash,
    Activity,
    ShieldCheck,
    Zap,
    BarChart3
} from 'lucide-react';
import { fetchAdminOrders } from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from '../components/NotificationBell';

const OrderManagement = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadOrders = async () => {
        setIsLoading(true);
        try {
            const data = await fetchAdminOrders({
                page: currentPage,
                search: searchTerm,
                status: statusFilter
            });
            setOrders(data.results || []);
            setTotalPages(Math.ceil(data.count / 20) || 1);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, [currentPage, statusFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        loadOrders();
    };

    const getStatusColor = (status) => {
        const s = (status || '').toLowerCase();
        switch (s) {
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'confirmed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'processing': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
            case 'shipping':
            case 'shipped': return 'bg-violet-500/10 text-violet-500 border-violet-500/20';
            case 'out_for_delivery': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'cancelled': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            default: return isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    return (
        <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
            <Sidebar isSidebarOpen={isSidebarOpen} activePage="Orders" onLogout={() => window.location.href = '/'} />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                <header className={`border-b px-8 h-20 flex items-center justify-between sticky top-0 z-20 transition-all duration-300 ${isDarkMode ? 'bg-[#0f172a]/80 border-slate-800 backdrop-blur-md' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-indigo-600 shadow-sm'}`}>
                            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Execution Grid</h1>
                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-widest ${isDarkMode ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>Real-time</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Order Synchronization</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <NotificationBell />
                        <div className={`hidden lg:flex items-center border rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest gap-2 ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                            <Zap className="w-3.5 h-3.5" /> Core Status
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Volume', value: orders.length, icon: BarChart3, color: 'indigo' },
                                { label: 'Active Transit', value: orders.filter(o => ['shipped', 'out_for_delivery'].includes(o.status?.toLowerCase())).length, icon: Activity, color: 'violet' },
                                { label: 'Clearance', value: orders.filter(o => o.status?.toLowerCase() === 'delivered').length, icon: ShieldCheck, color: 'emerald' },
                                { label: 'Pending Auth', value: orders.filter(o => o.status?.toLowerCase() === 'pending').length, icon: Calendar, color: 'amber' }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`p-6 rounded-[2.5rem] border transition-all duration-300 group ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800 hover:border-slate-700 hover:bg-[#1e293b]/80' : 'bg-white border-slate-100 shadow-sm hover:shadow-xl'}`}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${stat.color === 'indigo' ? (isDarkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600') :
                                            stat.color === 'violet' ? (isDarkMode ? 'bg-violet-500/10 text-violet-400' : 'bg-violet-50 text-violet-600') :
                                                stat.color === 'emerald' ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600') :
                                                    (isDarkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600')
                                            }`}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-[2px] text-slate-500 mb-1">{stat.label}</p>
                                            <p className={`text-2xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className={`p-4 rounded-[3rem] border transition-all duration-300 flex flex-col md:flex-row gap-4 items-center ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                            <form onSubmit={handleSearch} className="relative flex-1 w-full group">
                                <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isDarkMode ? 'text-slate-500 group-focus-within:text-indigo-400' : 'text-slate-400 group-focus-within:text-indigo-600'}`} />
                                <input
                                    type="text"
                                    placeholder="Trace command (ID, Email, or Hash)..."
                                    className={`w-full pl-12 pr-6 py-4 rounded-[2rem] text-sm focus:outline-none focus:ring-4 transition-all font-bold tracking-tight uppercase ${isDarkMode
                                        ? 'bg-slate-900/50 border-slate-800 text-white placeholder-slate-600 focus:ring-indigo-500/10 focus:border-indigo-500'
                                        : 'bg-slate-50 border-transparent text-slate-900 placeholder-slate-400 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-200 shadow-inner'
                                        }`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </form>
                            <div className="flex items-center gap-3 w-full md:w-auto pr-2">
                                <div className={`px-4 py-4 rounded-[2rem] flex items-center gap-3 min-w-[220px] transition-colors ${isDarkMode ? 'bg-slate-900/50 border border-slate-800' : 'bg-slate-100'}`}>
                                    <Filter className="w-4 h-4 text-slate-500" />
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => {
                                            setStatusFilter(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="bg-transparent text-[10px] font-black uppercase tracking-widest focus:outline-none w-full text-slate-400"
                                    >
                                        <option value="">Status: Universal</option>
                                        <option value="pending">Pending Auth</option>
                                        <option value="processing">In Processor</option>
                                        <option value="shipping">Logistics Transit</option>
                                        <option value="out_for_delivery">Final Mile</option>
                                        <option value="delivered">Success Final</option>
                                        <option value="cancelled">Node Kill</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className={`rounded-[3rem] border overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800 shadow-sm shadow-indigo-500/5' : 'bg-white border-slate-100 shadow-md'}`}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className={`border-b transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
                                        <tr>
                                            {['Transmission Identity', 'Entity Endpoint', 'Payload Value', 'Logistics Protocol', 'Admin Control'].map(h => (
                                                <th key={h} className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[3px] italic">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y transition-colors duration-300 ${isDarkMode ? 'divide-slate-800' : 'divide-slate-50'}`}>
                                        <AnimatePresence mode="wait">
                                            {isLoading ? (
                                                Array(5).fill(0).map((_, i) => (
                                                    <tr key={i} className="animate-pulse">
                                                        <td colSpan="5" className="px-10 py-10"><div className={`h-14 rounded-3xl w-full ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100'}`} /></td>
                                                    </tr>
                                                ))
                                            ) : orders.length === 0 ? (
                                                <motion.tr
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                >
                                                    <td colSpan="5" className="px-10 py-32 text-center text-slate-500 uppercase tracking-widest font-black italic opacity-50">
                                                        <Package className="mx-auto mb-6 w-16 h-16 opacity-10" />
                                                        No Signals Detected in this domain
                                                    </td>
                                                </motion.tr>
                                            ) : orders.map((order, index) => (
                                                <motion.tr
                                                    key={order.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className={`group transition-all duration-300 ${isDarkMode ? 'hover:bg-indigo-500/5' : 'hover:bg-indigo-50/50'}`}
                                                >
                                                    <td className="px-10 py-8">
                                                        <div className="flex items-center gap-6">
                                                            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-500 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-indigo-400 group-hover:border-indigo-500/30' : 'bg-white shadow-sm border-slate-100 text-indigo-600 group-hover:border-indigo-200'}`}>
                                                                <Hash className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <div className={`text-base font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{order.order_number}</div>
                                                                <div className="text-[9px] text-slate-500 font-black uppercase tracking-[2px] flex items-center gap-2 mt-1">
                                                                    <Calendar className="w-3.5 h-3.5" /> {new Date(order.created_at).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-8">
                                                        <div className={`text-xs font-bold tracking-tight ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{order.customer_email}</div>
                                                    </td>
                                                    <td className="px-10 py-8">
                                                        <div className={`text-lg font-black italic ${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>₹{parseFloat(order.total_amount).toLocaleString()}</div>
                                                    </td>
                                                    <td className="px-10 py-8">
                                                        <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-10 py-8">
                                                        <button
                                                            onClick={() => navigate(`/orders/${order.id}`)}
                                                            className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border group/btn ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10' : 'bg-white border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-500/10 active:scale-95'}`}
                                                        >
                                                            Open Nexus <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                                                        </button>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>

                            <div className={`px-10 py-8 border-t flex items-center justify-between transition-colors ${isDarkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[4px]">Data Page</span>
                                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black italic transition-all ${isDarkMode ? 'bg-slate-900 text-indigo-400' : 'bg-white text-indigo-600 shadow-sm'}`}>
                                        {currentPage} / {totalPages}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        className={`p-3 rounded-2xl transition-all border disabled:opacity-20 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800' : 'bg-white border-slate-100 text-slate-400 hover:text-indigo-600 shadow-sm hover:shadow-md'}`}
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        className={`p-3 rounded-2xl transition-all border disabled:opacity-20 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800' : 'bg-white border-slate-100 text-slate-400 hover:text-indigo-600 shadow-sm hover:shadow-md'}`}
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default OrderManagement;
