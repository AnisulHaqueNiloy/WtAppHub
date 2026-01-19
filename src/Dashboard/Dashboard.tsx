import React, { useState, useEffect, useContext } from "react";
import {
  UploadCloud,
  Send,
  CheckCircle2,
  ListFilter,
  Activity,
  XCircle,
} from "lucide-react";
import io from "socket.io-client";
import Papa from "papaparse";
import { toast } from "react-hot-toast";

// Context & API Hooks
import { authContext } from "../AuthContext/AuthProvider";
import { useSendBulkMutation } from "../redux/features/settings/settingApi";

// Socket connection
const socket = io("https://api.wtapphub.com");
// const socket = io("http://localhost:5000");

interface Contact {
  number: string;
  status: "pending" | "sending" | "sent" | "failed";
}

const Dashboard = () => {
  const authContextValue = useContext(authContext);
  const user = authContextValue?.user;
  const [message, setMessage] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);

  // 1. RTK Query Mutation Hook
  const [sendBulk, { isLoading: isCampaignStarting }] = useSendBulkMutation();

  // System status check from Context
  const isSystemReady = user?.waToken && user.waToken !== "";

  // 2. Real-time Status Update via Socket
  useEffect(() => {
    socket.on(
      "msgStatus",
      (data: { index: number; status: "sending" | "sent" | "failed" }) => {
        setContacts((prev) => {
          const updated = [...prev];
          if (updated[data.index]) {
            updated[data.index].status = data.status;
          }
          return updated;
        });
      },
    );

    return () => {
      socket.off("msgStatus");
    };
  }, []);

  // 3. CSV Parsing Logic
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          const extractedNumbers = results.data
            .flat()
            .filter((num: any) => num && num.toString().length >= 10)
            .map((num: any) => ({
              number: num.toString().trim(),
              status: "pending" as const,
            }));

          setContacts(extractedNumbers);
          toast.success(
            `${extractedNumbers.length} numbers loaded successfully!`,
          );
        },
        header: false,
        skipEmptyLines: true,
      });
    }
  };

  // 4. Send Messages via RTK Query
  const handleStartCampaign = async () => {
    if (!isSystemReady) {
      return toast.error("Please update your API Key in Settings first!");
    }
    if (contacts.length === 0) return toast.error("Please upload a CSV file!");
    if (!message) return toast.error("Please write a message!");

    try {
      const numbersOnly = contacts.map((c) => c.number);

      // RTK Query Trigger
      await sendBulk({
        numbers: numbersOnly,
        message: message,
      }).unwrap();

      toast.success("Campaign triggered successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to start campaign");
      console.error("Campaign Error:", err);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header Section - Improved for Mobile */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-10 gap-4">
        <div className="w-full md:w-auto">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Campaign Console
          </h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">
            Ready to reach{" "}
            <span className="text-blue-600 font-bold">
              {contacts.length} recipients
            </span>{" "}
            via WhatsApp.
          </p>
        </div>

        {/* Status indicator full width on mobile */}
        <div className="w-full md:w-auto bg-white px-4 py-2 rounded-xl md:rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center md:justify-start gap-2">
          {isSystemReady ? (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              <span className="text-xs font-bold text-slate-600 uppercase">
                System Ready
              </span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs font-bold text-red-600 uppercase">
                Not Ready (Update Settings)
              </span>
            </>
          )}
        </div>
      </header>

      {/* Main Grid - Responsive Layout */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Controls (Full width on mobile/tablet) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* File Upload Card */}
          <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl border border-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                <UploadCloud size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Source Numbers</h3>
            </div>

            <label className="group relative flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[1.5rem] md:rounded-[2rem] py-8 md:py-12 hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="text-center px-4">
                <p className="text-blue-600 font-extrabold text-lg">
                  Click to Upload
                </p>
                <p className="text-slate-400 text-xs mt-1 font-medium">
                  CSV files only
                </p>
              </div>
            </label>
          </div>

          {/* Message Content Card */}
          <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl border border-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                <Activity size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Compose Content</h3>
            </div>

            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-100 rounded-2xl md:rounded-3xl p-4 md:p-5 outline-none text-slate-700 transition-all resize-none text-sm md:text-base"
              placeholder="Hi, welcome to our service!"
            />

            <button
              onClick={handleStartCampaign}
              disabled={
                isCampaignStarting || contacts.length === 0 || !isSystemReady
              }
              className={`w-full mt-6 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] font-black text-white shadow-2xl transition transform active:scale-95 flex items-center justify-center gap-3 ${
                isCampaignStarting || contacts.length === 0 || !isSystemReady
                  ? "bg-slate-200 cursor-not-allowed text-slate-400 shadow-none"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-200"
              }`}
            >
              <Send size={20} />
              <span className="uppercase tracking-wider">
                {isCampaignStarting ? "STARTING..." : "START BROADCAST"}
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Queue (Full width on mobile, scrolling handled) */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl border border-white overflow-hidden flex flex-col h-[500px] md:h-[700px]">
          <div className="p-6 md:p-8 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <ListFilter className="text-slate-400" size={20} />
              <h3 className="font-black text-slate-800 uppercase tracking-tighter text-base md:text-lg">
                Live Delivery Queue
              </h3>
            </div>
            {contacts.length > 0 && (
              <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-md font-bold text-slate-500">
                {contacts.length} TOTAL
              </span>
            )}
          </div>

          <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
            <table className="w-full text-left min-w-[300px]">
              <thead className="bg-slate-50/50">
                <tr className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  <th className="px-6 md:px-10 py-4 md:py-5">Recipient</th>
                  <th className="px-6 md:px-10 py-4 md:py-5 text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {contacts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-6 md:px-10 py-20 md:py-32 text-center text-slate-300 font-medium"
                    >
                      <div className="flex flex-col items-center gap-2 opacity-40">
                        <Activity size={48} />
                        <p className="text-sm">
                          No numbers in queue. Start by uploading a CSV.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact, index) => (
                    <tr
                      key={index}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 md:px-10 py-4 md:py-6">
                        <span className="text-slate-900 font-bold tracking-tight text-sm md:text-lg">
                          {contact.number}
                        </span>
                      </td>
                      <td className="px-6 md:px-10 py-4 md:py-6 text-center">
                        {contact.status === "pending" && (
                          <span className="bg-slate-100 text-slate-400 px-3 py-1 md:px-4 md:py-1.5 rounded-lg md:rounded-xl text-[10px] font-black uppercase">
                            Waiting
                          </span>
                        )}
                        {contact.status === "sending" && (
                          <span className="bg-blue-600 text-white px-3 py-1 md:px-4 md:py-1.5 rounded-lg md:rounded-xl text-[10px] font-black uppercase animate-pulse shadow-lg shadow-blue-200">
                            Sending
                          </span>
                        )}
                        {contact.status === "sent" && (
                          <span className="bg-emerald-50 text-emerald-600 px-3 py-1 md:px-4 md:py-1.5 rounded-lg md:rounded-xl text-[10px] font-black uppercase inline-flex items-center gap-1.5">
                            <span className="hidden xs:inline">Delivered</span>{" "}
                            <CheckCircle2 size={12} />
                          </span>
                        )}
                        {contact.status === "failed" && (
                          <span className="bg-red-50 text-red-600 px-3 py-1 md:px-4 md:py-1.5 rounded-lg md:rounded-xl text-[10px] font-black uppercase inline-flex items-center gap-1.5">
                            <span className="hidden xs:inline">Failed</span>{" "}
                            <XCircle size={12} />
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
