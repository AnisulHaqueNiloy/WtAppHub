 
import {
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  ArrowUpRight,
} from "lucide-react";

const Analytics = () => {
  const stats = [
    {
      label: "Total Messages",
      value: "12,840",
      icon: <Users size={20} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "+12%",
    },
    {
      label: "Success Rate",
      value: "98.2%",
      icon: <TrendingUp size={20} />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: "+0.4%",
    },
    {
      label: "Delivered",
      value: "12,610",
      icon: <CheckCircle size={20} />,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      trend: "+10%",
    },
    {
      label: "Failed",
      value: "230",
      icon: <XCircle size={20} />,
      color: "text-red-600",
      bg: "bg-red-50",
      trend: "-2%",
    },
  ];

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header */}
      <header className="mb-8 md:mb-10 px-2">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Performance Analytics
        </h1>
        <p className="text-sm md:text-base text-slate-500">
          Real-time insights into your WhatsApp marketing campaigns.
        </p>
      </header>

      {/* Stats Grid */}
      {/* sm:grid-cols-2 (tablet) and lg:grid-cols-4 (desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                {stat.icon}
              </div>
              <span
                className={`flex items-center text-[10px] font-bold px-2 py-1 rounded-lg ${
                  stat.trend.startsWith("+")
                    ? "text-emerald-600 bg-emerald-50"
                    : "text-red-600 bg-red-50"
                }`}
              >
                {stat.trend} <ArrowUpRight size={10} className="ml-0.5" />
              </span>
            </div>

            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <h3 className="text-2xl font-black text-slate-900">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart Area */}
      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[350px] md:h-[500px] flex flex-col items-center justify-center text-center">
        <div className="bg-slate-50 p-6 rounded-full mb-4">
          <TrendingUp size={40} className="text-slate-300" />
        </div>
        <h4 className="text-slate-900 font-bold text-lg mb-2">
          Transmission Trends
        </h4>
        <p className="text-slate-400 max-w-xs text-sm italic font-medium">
          Chart visualizations (Recharts/Chart.js) will dynamically render here
          based on campaign data.
        </p>

        {/* Placeholder Bars for UI Feel */}
        <div className="flex items-end gap-2 mt-8 h-20">
          <div className="w-4 bg-blue-100 rounded-t-md h-1/2"></div>
          <div className="w-4 bg-blue-200 rounded-t-md h-3/4"></div>
          <div className="w-4 bg-blue-600 rounded-t-md h-full"></div>
          <div className="w-4 bg-blue-300 rounded-t-md h-2/3"></div>
          <div className="w-4 bg-blue-100 rounded-t-md h-1/3"></div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
