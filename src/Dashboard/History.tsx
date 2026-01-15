import  { useState } from "react";
import {
  Search,
   
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react";

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const historyData = Array.from({ length: 15 }, (_, i) => ({
    id: `${i + 1}`,
    number: `88017000000${i}`,
    message:
      "Welcome to our premium WhatsApp bulk messaging service! This is a test message.",
    date: "Jan 09, 2026 • 10:30 AM",
    status: i % 3 === 0 ? "sent" : i % 3 === 1 ? "failed" : "pending",
  }));

  return (
    // 'h-screen' use kora hoyeche jate screen-er baire kichu na jay
    <div className="flex flex-col h-[calc(100vh-100px)] animate-in fade-in duration-500 overflow-hidden">
      {/* Header Section (Fixed Height) */}
      <div className="shrink-0 px-2 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Campaign History
            </h1>
            <p className="text-sm text-slate-500">
              View and manage your sent transmission logs.
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition shadow-sm w-fit">
            <Download size={18} />
            <span className="text-sm">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Container Card (Inflexible Height) */}
      <div className="flex-1 flex flex-col bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden min-h-0">
        {/* Search Bar (Sticky at top of Card) */}
        <div className="p-4 border-b border-slate-50 shrink-0 bg-slate-50/20">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search history..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* --- SCROLLABLE TABLE WRAPPER --- */}
        {/* 'overflow-auto' eikhanei shob magic korbe */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black border-b border-slate-100">
                <th className="px-8 py-4 bg-white">Recipient</th>
                <th className="px-8 py-4 bg-white">Message Content</th>
                <th className="px-8 py-4 bg-white">Date & Time</th>
                <th className="px-8 py-4 bg-white text-center">Status</th>
                <th className="px-8 py-4 bg-white text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {historyData.map((log) => (
                <tr
                  key={log.id}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className="text-slate-900 font-bold text-sm tracking-tight">
                      {log.number}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-slate-500 text-sm min-w-[300px] line-clamp-1">
                      {log.message}
                    </p>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className="text-slate-400 text-[11px] font-bold uppercase tracking-tighter">
                      {log.date}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex justify-center">
                      <span
                        className={`
                        px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 border whitespace-nowrap
                        ${
                          log.status === "sent"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : log.status === "failed"
                            ? "bg-red-50 text-red-600 border-red-100"
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        }
                      `}
                      >
                        {log.status === "sent" ? (
                          <CheckCircle2 size={12} />
                        ) : log.status === "failed" ? (
                          <XCircle size={12} />
                        ) : (
                          <Clock size={12} />
                        )}
                        {log.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right whitespace-nowrap">
                    <button className="text-slate-300 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg">
                      <ExternalLink size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer (Fixed at bottom of Card) */}
        <div className="px-8 py-4 border-t border-slate-100 flex items-center justify-between bg-white shrink-0">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Total: {historyData.length}
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 border border-slate-100 rounded-lg text-xs font-bold text-slate-400 hover:bg-slate-50 transition">
              Prev
            </button>
            <button className="px-4 py-1.5 bg-blue-600 rounded-lg text-xs font-bold text-white shadow-lg shadow-blue-100">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
