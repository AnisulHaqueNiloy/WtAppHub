import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Key,
  PlusCircle,
  Link2,
  QrCode,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import {
  useCreateSessionMutation,
  useConnectSessionMutation,
  useSessionStatusQuery,
  useTokenUpdateMutation,
} from "../redux/features/settings/settingApi";

const Setting = () => {
  const [waToken, setWaToken] = useState("");
  const [updateToken, { isLoading: isTokenSaving }] = useTokenUpdateMutation();

  const [step, setStep] = useState(1);
  const [sessionInfo, setSessionInfo] = useState({
    name: "",
    phoneNumber: "",
    sessionId: "",
  });
  const [qrCode, setQrCode] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const [createSession, { isLoading: isCreating }] = useCreateSessionMutation();
  const [connectSession, { isLoading: isConnecting }] =
    useConnectSessionMutation();

  // --- Polling Logic: Step 3 তে থাকলে ৫ সেকেন্ড পর পর হিট করবে ---
  const { data: statusData, refetch } = useSessionStatusQuery(
    sessionInfo.sessionId,
    {
      pollingInterval: step === 3 && !isConnected ? 5000 : 0,
      skip: !sessionInfo.sessionId,
    },
  );

  useEffect(() => {
    if (statusData) {
      // ব্যাকএন্ড থেকে আসা qrCode স্ট্রিং সেট করা
      if (statusData.qrCode) {
        setQrCode(statusData.qrCode);
      }
      if (statusData.status === "connected") {
        setIsConnected(true);
        setQrCode("");
        toast.success("WhatsApp Connected! 🎉");
      }
    }
  }, [statusData]);

  const handleTokenUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waToken) return toast.error("Please enter a token!");
    try {
      await updateToken({ waToken }).unwrap();
      toast.success("API Key updated! 🚀");
      setWaToken("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update token");
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createSession({
        name: sessionInfo.name,
        phoneNumber: sessionInfo.phoneNumber,
      }).unwrap();

      // ব্যাকএন্ড যদি res.data.sessionId পাঠায়
      const sid = res.data?.sessionId || res.sessionId;
      setSessionInfo((prev) => ({ ...prev, sessionId: sid }));
      setStep(2);
      toast.success("Session created! Please connect.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create session");
    }
  };

  const handleConnect = async () => {
    try {
      await connectSession({ sessionId: sessionInfo.sessionId }).unwrap();
      setStep(3);
      toast.success("Initializing server instance...");
    } catch (err: any) {
      toast.error("Failed to connect instance.");
    }
  };

  // QR রেন্ডারিং লজিক (Base64 প্রিফিক্স চেক)
  const renderQRCode = () => {
    // কনসোলে চেক করুন স্ট্রিংটি কেমন আসছে
    console.log("Current QR String:", qrCode);

    if (!qrCode) return <div className="animate-spin ..."></div>;

    // অনেক সময় ব্যাকএন্ড সরাসরি QR কোড না পাঠিয়ে একটি URL পাঠায়
    // যদি সেটি http দিয়ে শুরু হয় তবে সরাসরি বসান
    if (qrCode.startsWith("http")) {
      return <img src={qrCode} alt="WhatsApp QR" className="w-40 h-40" />;
    }

    // Base64 চেক: যদি অলরেডি prefix থাকে তবে সেটা ব্যবহার করবে, না থাকলে যোগ করবে
    const qrSrc = qrCode.includes("base64,")
      ? qrCode
      : `data:image/png;base64,${qrCode}`;

    return (
      <img
        src={qrSrc}
        alt="WhatsApp QR"
        key={qrCode} // key যোগ করলে প্রতিবার নতুন কিউআর আসলে ইমেজ রিফ্রেশ হবে
        className="w-40 h-40 object-contain shadow-inner"
        onError={(e) => console.error("Image Load Error:", e)}
      />
    );
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 space-y-10 mb-20">
      {/* SECTION 1: MASTER TOKEN */}
      <section className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-gray-100 transition-all hover:shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
            <Key size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              Wasender Configuration
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Master Access Token
            </p>
          </div>
        </div>

        <form
          onSubmit={handleTokenUpdate}
          className="flex flex-col md:flex-row gap-4"
        >
          <input
            type="password"
            value={waToken}
            onChange={(e) => setWaToken(e.target.value)}
            className="flex-1 px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-200 focus:bg-white rounded-2xl outline-none transition-all"
            placeholder="Paste your Wasender Master API Key here..."
          />
          <button
            type="submit"
            disabled={isTokenSaving}
            className="px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 active:scale-95 transition-all"
          >
            {isTokenSaving ? "Saving..." : "Update Key"}
          </button>
        </form>
      </section>

      <hr className="border-slate-100" />

      {/* SECTION 2: CONNECTION WIZARD */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-black text-slate-900">Link Device</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Follow these three simple steps to connect your WhatsApp number with
            our system.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* STEP 1: CREATE */}
          <div
            className={`relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 ${step === 1 ? "bg-white border-blue-500 shadow-2xl scale-105 z-10" : "bg-gray-50 border-transparent opacity-40 grayscale"}`}
          >
            <div className="absolute -top-4 -right-4 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-black shadow-lg">
              1
            </div>
            <h3 className="font-bold flex items-center gap-2 mb-6 text-slate-800">
              <PlusCircle size={20} /> Create Session
            </h3>
            <form onSubmit={handleCreateSession} className="space-y-4">
              <input
                required
                disabled={step !== 1}
                className="w-full p-4 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Session Name"
                onChange={(e) =>
                  setSessionInfo({ ...sessionInfo, name: e.target.value })
                }
              />
              <input
                required
                disabled={step !== 1}
                className="w-full p-4 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Phone (880...)"
                onChange={(e) =>
                  setSessionInfo({
                    ...sessionInfo,
                    phoneNumber: e.target.value,
                  })
                }
              />
              {step === 1 && (
                <button
                  disabled={isCreating}
                  className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all"
                >
                  {isCreating ? "Initializing..." : "Get Started"}
                </button>
              )}
            </form>
          </div>

          {/* STEP 2: CONNECT */}
          <div
            className={`relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 ${step === 2 ? "bg-white border-indigo-500 shadow-2xl scale-105 z-10" : "bg-gray-50 border-transparent opacity-40 grayscale"}`}
          >
            <div className="absolute -top-4 -right-4 bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-black shadow-lg">
              2
            </div>
            <h3 className="font-bold flex items-center gap-2 mb-6 text-slate-800">
              <Link2 size={20} /> Connect
            </h3>
            <p className="text-xs text-slate-500 mb-8 leading-relaxed">
              Starting the WhatsApp engine on the server. This may take up to 30
              seconds.
            </p>
            <button
              disabled={step !== 2 || isConnecting}
              onClick={handleConnect}
              className={`w-full py-4 rounded-2xl font-black transition-all ${step === 2 ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg" : "bg-slate-200 text-slate-400"}`}
            >
              {isConnecting ? "Connecting..." : "Connect Now"}
            </button>
          </div>

          {/* STEP 3: SCAN QR */}
          <div
            className={`relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 ${step === 3 ? "bg-white border-emerald-500 shadow-2xl scale-105 z-10" : "bg-gray-50 border-transparent opacity-40 grayscale"}`}
          >
            <div className="absolute -top-4 -right-4 bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-black shadow-lg">
              3
            </div>
            <h3 className="font-bold flex items-center gap-2 mb-6 text-slate-800">
              <QrCode size={20} /> Scan QR
            </h3>
            <div className="aspect-square bg-slate-50 rounded-[2rem] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 overflow-hidden relative group">
              {isConnected ? (
                <div className="flex flex-col items-center animate-in zoom-in duration-500">
                  <CheckCircle2 size={60} className="text-emerald-500 mb-2" />
                  <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">
                    Linked
                  </span>
                </div>
              ) : (
                renderQRCode()
              )}
            </div>
            {step === 3 && !isConnected && (
              <button
                onClick={() => refetch()}
                className="w-full mt-4 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 hover:text-emerald-600 transition-colors uppercase"
              >
                <RefreshCw size={12} /> Force Refresh QR
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Security Policy */}
      <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center gap-6 shadow-2xl">
        <div className="bg-emerald-500/20 p-4 rounded-2xl text-emerald-400">
          <ShieldCheck size={32} />
        </div>
        <div>
          <h4 className="font-bold text-lg mb-1">Encrypted Connection</h4>
          <p className="text-slate-400 text-sm leading-relaxed text-balance">
            Your WhatsApp session is stored securely. We do not store your
            private messages. Keep your device connected to the internet to
            avoid disconnection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Setting;
