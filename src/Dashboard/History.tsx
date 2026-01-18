import { useState } from "react";
import {
  Search,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Loader2,
  RefreshCcw,
  Smartphone,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import { useGetHistoryQuery } from "../redux/features/history/history";

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError, refetch } = useGetHistoryQuery();

  // 1. Data Filter and Sorting (Latest First)
  const filteredHistory = data?.history
    ? [...data.history]
        .filter((log: any) =>
          log.phoneNumber.includes(searchTerm) || 
          log.messageContent.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
    : [];

  // 2. CSV Export Logic
  const exportToCSV = () => {
    if (!filteredHistory || filteredHistory.length === 0) return;

    const headers = ["Phone Number", "Message Content", "Status", "Sent At"];
    const rows = filteredHistory.map((log: any) => [
      log.phoneNumber,
      `"${log.messageContent.replace(/"/g, '""')}"`,
      log.status,
      log.sentAt ? format(new Date(log.sentAt), "yyyy-MM-dd HH:mm") : "N/A"
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Campaign_History_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-medium tracking-tight">Loading campaign history...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen animate-in fade-in duration-500 pb-10">
      
      {/* Header Section */}
      <div className="px-2 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Campaign History
            </h1>
            <p className="text-slate-500 mt-1">
              Check all your previously sent message logs.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => refetch()} 
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition shadow-sm"
            >
              <RefreshCcw size={18} />
              Refresh
            </button>
            <button 
              onClick={exportToCSV}
              disabled={filteredHistory.length === 0}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 px-6 py-3 rounded-2xl text-white font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50"
            >
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="px-2 mb-6">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search by number or message..."
            className="w-full pl-14 pr-6 py-4 bg-white border-2 border-transparent rounded-[2rem] shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none text-base transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid Card Layout Area */}
      {isError ? (
        <div className="p-10 text-center text-red-500 bg-red-50 rounded-3xl mx-2 border border-red-100 font-medium">
          Something went wrong while fetching data. Please try again.
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="p-20 text-center text-slate-400 font-medium">
           No history found {searchTerm && `for "${searchTerm}"`}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-2">
          {filteredHistory.map((log: any) => (
            <div 
              key={log._id} 
              className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              {/* Status Ribbon */}
              <div className="absolute top-0 right-0">
                <div className={`px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest ${
                  log.status === "sent" ? "bg-emerald-50 text-emerald-600" : 
                  log.status === "failed" ? "bg-red-50 text-red-600" : 
                  "bg-amber-50 text-amber-600"
                }`}>
                  {log.status}
                </div>
              </div>

              {/* Number & Date */}
              <div className="flex items-start gap-4 mb-5">
                <div className={`p-3 rounded-2xl ${
                  log.status === "sent" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                }`}>
                  <Smartphone size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    {log.phoneNumber}
                  </h3>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold mt-0.5">
                    <Calendar size={12} />
                    {log.sentAt ? format(new Date(log.sentAt), "MMM dd, yyyy • hh:mm a") : "Date N/A"}
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="bg-slate-50/50 p-4 rounded-2xl mb-5 border border-slate-50">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <MessageSquare size={14} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Message Content</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 italic group-hover:line-clamp-none transition-all">
                  "{log.messageContent}"
                </p>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  {log.status === "sent" ? (
                    <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                      <CheckCircle2 size={14} /> Delivered
                    </div>
                  ) : log.status === "failed" ? (
                    <div className="flex items-center gap-1 text-red-500 text-xs font-bold">
                      <XCircle size={14} /> Failed
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Clock size={14} /> Processing
                    </div>
                  )}
                </div>
                {/* <button className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-sm">
                  <ExternalLink size={16} />
                </button> */}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Total Records Info */}
      {!isError && filteredHistory.length > 0 && (
        <div className="mt-12 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Total transmissions: {filteredHistory.length}
            </p>
        </div>
      )}
    </div>
  );
};

export default History;