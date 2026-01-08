import React, { useState } from "react";
import {
  UploadCloud,
  Send,
  CheckCircle2,
  ListFilter,
  Activity,
} from "lucide-react";

interface Contact {
  number: string;
  status: "pending" | "sending" | "sent" | "failed";
}

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isSending, setIsSending] = useState(false);

  // CSV parsing logic (Dummy)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // simulate extracting numbers
      const dummyNumbers: Contact[] = [
        { number: "8801700000001", status: "pending" },
        { number: "8801800000002", status: "pending" },
        { number: "8801900000003", status: "pending" },
        { number: "8801631484734", status: "pending" },
        { number: "8801500000005", status: "pending" },
      ];
      setContacts(dummyNumbers);
    }
  };

  const sendMessages = async () => {
    if (contacts.length === 0 || !message) return;
    setIsSending(true);

    const updatedContacts = [...contacts];

    for (let i = 0; i < updatedContacts.length; i++) {
      updatedContacts[i].status = "sending";
      setContacts([...updatedContacts]);

      // Simulating Backend API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      updatedContacts[i].status = "sent";
      setContacts([...updatedContacts]);
    }
    setIsSending(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <header className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Campaign Console
          </h1>
          <p className="text-slate-500 mt-1">
            Ready to reach{" "}
            <span className="text-blue-600 font-bold">
              {contacts.length} recipients
            </span>{" "}
            via WhatsApp.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            <span className="text-xs font-bold text-slate-600 uppercase">
              System Ready
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Input Controls */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Step 1: Upload */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                <UploadCloud size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Source Numbers</h3>
            </div>

            <label className="group relative flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] py-12 hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer overflow-hidden">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="text-center group-hover:scale-110 transition-transform duration-300">
                <p className="text-blue-600 font-extrabold text-lg">
                  Click to Upload
                </p>
                <p className="text-slate-400 text-xs mt-1 font-medium">
                  CSV files only
                </p>
              </div>
            </label>
          </div>

          {/* Step 2: Message */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                <Activity size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Compose Content</h3>
            </div>

            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-100 rounded-3xl p-5 focus:ring-4 focus:ring-blue-50 outline-none text-slate-700 transition-all resize-none placeholder:text-slate-300"
              placeholder="Hi {name}, welcome to our service!"
            />

            <button
              onClick={sendMessages}
              disabled={isSending || contacts.length === 0}
              className={`w-full mt-6 py-5 rounded-[1.5rem] font-black text-white shadow-2xl transition transform active:scale-95 flex items-center justify-center gap-3 ${
                isSending || contacts.length === 0
                  ? "bg-slate-200 cursor-not-allowed text-slate-400 shadow-none"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-200"
              }`}
            >
              <Send size={20} />
              {isSending ? "ENGINE RUNNING..." : "START BROADCAST"}
            </button>
          </div>
        </div>

        {/* Live Status Table */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ListFilter className="text-slate-400" size={20} />
              <h3 className="font-black text-slate-800 uppercase tracking-tighter text-lg">
                Live Delivery Queue
              </h3>
            </div>
            {isSending && (
              <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100 shadow-inner">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Active
                </span>
              </div>
            )}
          </div>

          <div className="overflow-y-auto flex-1 max-h-[600px] custom-scrollbar">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-white/80 backdrop-blur-md z-10">
                <tr className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  <th className="px-10 py-5">Recipient</th>
                  <th className="px-10 py-5 text-center">Current Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {contacts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-10 py-32 text-center text-slate-300 font-medium"
                    >
                      <div className="flex flex-col items-center gap-2 opacity-40">
                        <Activity size={48} />
                        <p>No numbers in queue. Start by uploading a CSV.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact, index) => (
                    <tr
                      key={index}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-10 py-6">
                        <span className="text-slate-900 font-bold tracking-tight text-lg">
                          {contact.number}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-center">
                        {contact.status === "pending" && (
                          <span className="bg-slate-100 text-slate-400 px-4 py-1.5 rounded-xl text-xs font-black uppercase">
                            Waiting
                          </span>
                        )}
                        {contact.status === "sending" && (
                          <span className="bg-blue-600 text-white px-4 py-1.5 rounded-xl text-xs font-black uppercase animate-pulse shadow-lg shadow-blue-200">
                            Sending
                          </span>
                        )}
                        {contact.status === "sent" && (
                          <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-xl text-xs font-black uppercase inline-flex items-center gap-1.5">
                            Delivered <CheckCircle2 size={14} />
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
