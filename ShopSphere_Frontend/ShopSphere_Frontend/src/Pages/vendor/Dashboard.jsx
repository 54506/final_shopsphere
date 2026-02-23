import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVendorProducts, getVendorOrders, getVendorProfile, getVendorEarningsSummary } from "../../api/vendor_axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import {
  FaStore,
  FaBox,
  FaShoppingCart,
  FaWallet,
  FaChartLine,
  FaHistory,
  FaFileInvoice,
  FaPercentage
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState({ revenue: "0.00", products: 0, orders: 0, available: "0.00", uncleared: "0.00" });
  const [salesChart, setSalesChart] = useState([
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
    { month: 'Apr', sales: 4500 },
    { month: 'May', sales: 6000 },
    { month: 'Jun', sales: 5500 },
  ]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [products, orders, profile] = await Promise.all([
          getVendorProducts(),
          getVendorOrders(),
          getVendorProfile()
        ]);

        setVendor(profile);

        const earningsSummary = await getVendorEarningsSummary();

        setStats({
          revenue: parseFloat(earningsSummary.lifetime_earnings || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
          products: products.length,
          orders: orders.length,
          available: parseFloat(earningsSummary.available_balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
          uncleared: parseFloat(earningsSummary.uncleared_balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
          totalGross: parseFloat(earningsSummary.total_gross || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
          totalCommission: parseFloat(earningsSummary.total_commission || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
          totalNet: parseFloat(earningsSummary.total_net || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
        });

        setRecentOrders(orders.slice(0, 5).map(o => ({
          id: o.order_id,
          order_number: o.order_number,
          name: o.product,
          amount: (parseFloat(o.price) * o.quantity).toFixed(2),
          status: o.status
        })));

      } catch (error) {
        console.error("Dashboard error:", error);
        if (error.response?.status === 403) {
          toast.error(error.response?.data?.error || "Access Denied");
          navigate('/login');
        } else {
          toast.error("Failed to load dashboard data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[60vh] transition-colors duration-300 ${isDarkMode ? 'bg-transparent' : 'bg-transparent'}`}>
        <div className={`w-16 h-16 border-4 rounded-full animate-spin mb-6 ${isDarkMode ? 'border-indigo-500/20 border-t-indigo-500' : 'border-slate-200 border-t-indigo-600'}`}></div>
        <p className={`text-[10px] font-black uppercase tracking-[5px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Loading your store...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative">
          <h1 className={`text-3xl md:text-4xl font-black tracking-tighter flex items-center gap-4 italic uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
              <FaStore size={22} />
            </div>
            Store Overview
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[4px] text-gray-500 mt-3 ml-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Shop: {vendor?.shop_name || "Active"}
          </p>
        </div>
        <div className={`flex p-1 rounded-2xl md:rounded-[24px] border backdrop-blur-sm w-full md:w-auto transition-colors duration-300 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
          <button className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl md:rounded-[18px] text-[10px] font-black uppercase tracking-[2px] shadow-lg transition-all ${isDarkMode ? 'bg-indigo-600 text-white shadow-indigo-900/40' : 'bg-slate-900 text-white shadow-slate-200'}`}>Current Status</button>
          <button className={`flex-1 md:flex-none px-6 py-2.5 text-[10px] font-black uppercase tracking-[2px] transition-all ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-indigo-600'}`}>History</button>
        </div>
      </header>

      {/* KPI CLUSTER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <KPICard title="My Balance" value={`₹${stats.available}`} icon={FaWallet} color="indigo" subtitle="Available now" isDarkMode={isDarkMode} />
        <KPICard title="Pending" value={`₹${stats.uncleared}`} icon={FaHistory} color="amber" subtitle="Next payout" isDarkMode={isDarkMode} />
        <KPICard title="Total Sales" value={`₹${stats.revenue}`} icon={FaChartLine} color="purple" subtitle="All-time" isDarkMode={isDarkMode} />
        <KPICard title="Orders" value={stats.orders} icon={FaShoppingCart} color="emerald" subtitle="Completed" isDarkMode={isDarkMode} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        {/* GRAPH */}
        <div className={`rounded-[32px] md:rounded-[48px] p-6 md:p-10 border shadow-2xl relative overflow-hidden group transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-white/5' : 'bg-white border-slate-100'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl opacity-30"></div>
          <div className="relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-10 gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${isDarkMode ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/10' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                  <FaChartLine size={18} />
                </div>
                <h3 className={`text-xl font-black tracking-tight italic uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Sales Growth</h3>
              </div>
              <div className={`px-4 py-2 border rounded-full text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-white/5 border-white/5 text-slate-500' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                Last 6 Months
              </div>
            </div>
            <div className="h-[250px] md:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesChart}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    contentStyle={{
                      background: isDarkMode ? '#0f172a' : '#fff',
                      border: isDarkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid #e2e8f0',
                      borderRadius: '16px',
                      fontSize: '12px'
                    }}
                    itemStyle={{ color: isDarkMode ? '#fff' : '#1e293b', fontWeight: 'bold' }}
                    cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RECENT ORDERS */}
        <div className={`rounded-[32px] md:rounded-[48px] p-6 md:p-10 border shadow-2xl flex flex-col transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-white/5' : 'bg-white border-slate-100'}`}>
          <div className="flex items-center gap-4 mb-8 md:mb-10">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${isDarkMode ? 'bg-purple-500/10 text-purple-400 border-purple-500/10' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
              <FaShoppingCart size={18} />
            </div>
            <h3 className={`text-xl font-black tracking-tight italic uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Recent Activity</h3>
          </div>

          <div className="flex-1 space-y-4">
            {recentOrders.length > 0 ? recentOrders.map((order, idx) => (
              <div key={idx} className={`p-4 md:p-5 flex justify-between items-center border rounded-2xl md:rounded-3xl transition-all group overflow-hidden ${isDarkMode ? 'bg-white/5 border-transparent hover:bg-white/10 hover:border-indigo-500/20' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-indigo-200 shadow-sm hover:shadow-md'}`}>
                <div className="min-w-0 flex-1 pr-3">
                  <p className={`text-xs md:text-sm font-black tracking-tight italic uppercase truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{order.id}</p>
                  <p className="text-[8px] md:text-[9px] font-black text-gray-500 uppercase tracking-widest truncate">{order.name}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs md:text-sm font-black text-indigo-500 tracking-tight">₹{order.amount}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest mt-1 ${order.status === 'received' ? 'bg-blue-500/10 text-blue-400' :
                    order.status === 'processing' ? 'bg-amber-500/10 text-amber-400' :
                      order.status === 'shipped' ? 'bg-purple-500/10 text-purple-400' :
                        'bg-emerald-500/10 text-emerald-400'
                    }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-10">
                <p className="text-[10px] font-black uppercase text-gray-600 italic">No activity yet</p>
              </div>
            )}
          </div>

          <button onClick={() => navigate('/vendororders')} className={`mt-8 w-full py-4 text-[10px] font-black uppercase tracking-[3px] rounded-2xl transition-all shadow-xl ${isDarkMode ? 'bg-indigo-600 text-white shadow-indigo-900/40 hover:bg-indigo-500' : 'bg-slate-900 text-white shadow-slate-200 hover:bg-indigo-600'}`}>
            Show All Orders
          </button>
        </div>
      </div>

      {/* FINANCIAL SUMMARY */}
      <div className={`rounded-[32px] md:rounded-[48px] p-6 md:p-10 border shadow-2xl transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-white/5' : 'bg-white border-slate-100'}`}>
        <div className="flex items-center gap-4 mb-10 md:mb-12">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
            <FaPercentage size={18} />
          </div>
          <h3 className={`text-xl font-black tracking-tight italic uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Money Summary</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
          <SettlementMetric label="Total Order Value" value={`₹${stats.totalGross}`} color={isDarkMode ? 'white' : 'slate'} isDarkMode={isDarkMode} />
          <SettlementMetric label="Platform Fee" value={`−₹${stats.totalCommission}`} color="rose" isDarkMode={isDarkMode} />
          <SettlementMetric label="Your Earnings" value={`₹${stats.totalNet}`} color="emerald" isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon: Icon, color, subtitle, isDarkMode }) {
  const colors = {
    indigo: isDarkMode ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/10' : 'text-indigo-600 bg-indigo-50 border-indigo-100',
    purple: isDarkMode ? 'text-purple-400 bg-purple-500/10 border-purple-500/10' : 'text-purple-600 bg-purple-50 border-purple-100',
    emerald: isDarkMode ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/10' : 'text-emerald-600 bg-emerald-50 border-emerald-100',
    amber: isDarkMode ? 'text-amber-400 bg-amber-500/10 border-amber-500/10' : 'text-amber-600 bg-amber-50 border-amber-100'
  };

  return (
    <div className={`p-6 md:p-8 rounded-[32px] md:rounded-[40px] border shadow-2xl transition-all group relative overflow-hidden ${isDarkMode ? 'bg-[#1e293b]/50 border-white/5 hover:border-indigo-500/30' : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-indigo-500/5'}`}>
      <div className="flex justify-between items-start">
        <div className={`p-3 md:p-4 rounded-2xl ${colors[color]} border group-hover:scale-110 transition-transform`}>
          <Icon size={18} className="md:size-[20px]" />
        </div>
      </div>
      <div className="mt-6 md:mt-8">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{title}</p>
        <p className={`text-2xl md:text-3xl font-black tracking-tighter truncate italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{value}</p>
        <p className={`text-[8px] font-bold uppercase tracking-widest mt-1 italic ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>{subtitle}</p>
      </div>
    </div>
  );
}

function SettlementMetric({ label, value, color, isDarkMode }) {
  const colorMap = {
    white: 'text-white',
    slate: 'text-slate-900',
    rose: 'text-rose-500',
    emerald: 'text-emerald-500'
  };

  return (
    <div className={`space-y-3 p-6 md:p-8 rounded-[28px] md:rounded-[32px] border transition-all ${isDarkMode ? 'bg-white/5 border-white/5 hover:border-white/10' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-indigo-100 shadow-sm'}`}>
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[3px] italic">{label}</p>
      <p className={`text-3xl md:text-4xl font-black tracking-tighter ${colorMap[color]} truncate italic`}>{value}</p>
      <div className={`w-12 h-1 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}></div>
    </div>
  );
}
