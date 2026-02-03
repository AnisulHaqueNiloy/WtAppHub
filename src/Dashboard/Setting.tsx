import  { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";
import { io } from "socket.io-client";
import {
  Key,
  PlusCircle,
  Link2,
  QrCode,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Loader2,
  X,
  Copy,
  Lock,
} from "lucide-react";
import {
  useCreateSessionMutation,
  useConnectSessionMutation,
  useSessionStatusQuery,
  useTokenUpdateMutation,
  useGetSessionStatusQuery,
  useDeleteSessionMutation,
} from "../redux/features/settings/settingApi";

const socket = io("http://localhost:5000");

const Setting = () => {
  const [waToken, setWaToken] = useState("");
  const [updateToken, { isLoading: isTokenSaving }] = useTokenUpdateMutation();

  const { refetch: refetchApiKey } = useGetSessionStatusQuery();
  const { data: sessionStatus, refetch: refetchSessionStatus } =
    useGetSessionStatusQuery();

  const [deleteSession, { isLoading: isDeleting }] = useDeleteSessionMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiKeyToShow, setApiKeyToShow] = useState("");
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

  // Helper to get ID
  const getSafeId = (data:any) => data?._id || data?.id || data?.sessionId;

 
  useEffect(() => {
  if (sessionInfo.sessionId) {
    const channel = `session_update_${sessionInfo.sessionId}`;
    
    socket.on(channel, (data) => {
      if (data.qrCode) setQrCode(data.qrCode);
      if (data.status === "connected" || data.status === "ready") {
        setIsConnected(true);
        setQrCode("");
        toast.success("WhatsApp Linked Successfully! 🎉");
        refetchSessionStatus();
      }
    });

    // সঠিক Cleanup Function
    return () => {
      socket.off(channel);
    };
  }
}, [sessionInfo.sessionId, refetchSessionStatus]);

  const {
    data: statusData,
    refetch,
    isFetching,
  } = useSessionStatusQuery(sessionInfo.sessionId, {
    pollingInterval: step === 3 && !isConnected ? 5000 : 0,
    skip: !sessionInfo.sessionId,
  });

  useEffect(() => {
    if (statusData && !isConnected) {
      if (statusData.qrCode) setQrCode(statusData.qrCode);
      if (statusData.status === "connected" || statusData.status === "ready") {
        setIsConnected(true);
        setQrCode("");
        toast.success("Connected! 🎉");
        refetchSessionStatus();
      }
    }
  }, [statusData, isConnected, refetchSessionStatus]);

  const handleShowApiKey = async () => {
    try {
      const result = await refetchApiKey();
      const responseData = result?.data;
      if (
        responseData?.status === "connected" ||
        responseData?.status === "ready"
      ) {
        const fetchedKey = responseData?.api_key;
        if (fetchedKey) {
          setApiKeyToShow(fetchedKey);
          setIsModalOpen(true);
        } else {
          toast.error("API key property mismatch! ❌");
        }
      } else {
        toast.error("Connect your number with QR first! ⚠️");
      }
    } catch (err) {
      toast.error("Failed to fetch status!");
    }
  };

  const copyToClipboard = () => {
    if (!apiKeyToShow) return toast.error("Key not found! ❌");
    navigator.clipboard.writeText(apiKeyToShow);
    toast.success("API Key copied! 📋");
  };

  const handleTokenUpdate = async (e:any) => {
    e.preventDefault();
    if (!waToken) return toast.error("Please enter a token!");
    try {
      await updateToken({ waToken }).unwrap();
      toast.success("API Key updated! 🚀");
      setTimeout(() => (window.location.href = "/dashboard"), 1500);
    } catch (err) {
      toast.error("Failed to update token");
    }
  };

  const handleCreateSession = async (e:any) => {
    e.preventDefault();
    try {
      const res = await createSession(sessionInfo).unwrap();
      const sid = res.data?.sessionId || res.sessionId || res.data?.id;
      setSessionInfo((prev) => ({ ...prev, sessionId: sid }));
      setStep(2);
      toast.success("Session Created!");
    } catch (err) {
      toast.error("Failed to create session");
    }
  };

  const handleConnect = async () => {
    try {
      await connectSession({ sessionId: sessionInfo.sessionId }).unwrap();
      setStep(3);
      toast.success("Fetching QR Code...");
    } catch (err) {
      toast.error("Connection failed.");
    }
  };

  // --- Hot Toast Replace Browser Alert ---
  const handleDeleteSession = (id:any) => {
    if (!id || id === "undefined") return toast.error("Invalid Session ID!");

    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-slate-800">
            Are you sure you want to delete?
          </span>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 text-xs bg-slate-200 text-slate-700 rounded-lg font-bold"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await deleteSession(id).unwrap();
                  toast.success("Deleted successfully! 🗑️");
                  refetchSessionStatus();
                  setIsConnected(false);
                  setQrCode("");
                  setStep(1);
                } catch (err) {
                  toast.error("Delete failed");
                }
              }}
              className="px-3 py-1 text-xs bg-red-600 text-white rounded-lg font-bold shadow-lg"
            >
              Confirm
            </button>
          </div>
        </div>
      ),
      {
        duration: 6000,
        position: "top-center",
      },
    );
  };

  const renderQRCode = () => {
    if (!qrCode)
      return <Loader2 className="animate-spin text-indigo-500" size={32} />;
    return (
      <QRCodeSVG value={qrCode} size={180} level="H" includeMargin={true} />
    );
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 space-y-10 mb-20 relative font-sans">
      <Toaster position="top-center" reverseOrder={false} />

      {/* API KEY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md relative animate-in zoom-in duration-300">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"
            >
              <X size={24} />
            </button>
            <div className="text-center space-y-4">
              <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-white shadow-xl">
                <Lock size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-800">
                API Access Key
              </h3>
              <div className="flex items-center gap-2 bg-slate-50 p-5 rounded-[1.5rem] border-2 border-slate-100 mt-6">
                <code className="flex-1 text-sm font-mono text-indigo-600 truncate font-bold">
                  {apiKeyToShow}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="text-slate-400 hover:text-indigo-600 transition-all active:scale-90"
                >
                  <Copy size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg">
              <Key size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                Wasender Config
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                General Settings
              </p>
            </div>
          </div>
          <button
            onClick={handleShowApiKey}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all"
          >
            <ShieldCheck size={18} /> Get API Key
          </button>
        </div>
        <form
          onSubmit={handleTokenUpdate}
          className="flex flex-col md:flex-row gap-4"
        >
          <input
            type="password"
            value={waToken}
            onChange={(e) => setWaToken(e.target.value)}
            className="flex-1 px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl outline-none"
            placeholder="Paste Master API Key..."
          />
          <button
            type="submit"
            disabled={isTokenSaving}
            className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-lg"
          >
            {isTokenSaving ? "Saving..." : "Update Key"}
          </button>
        </form>
      </section>

      {/* Step Wizard Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div
          className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 ${step === 1 ? "bg-white border-blue-500 shadow-xl" : "bg-slate-50 opacity-50 grayscale pointer-events-none"}`}
        >
          <h3 className="font-black flex items-center gap-2 mb-6 text-slate-800">
            <PlusCircle size={20} /> 1. Initialize
          </h3>
          <form onSubmit={handleCreateSession} className="space-y-4">
            <input
              required
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none"
              placeholder="Session Name"
              onChange={(e) =>
                setSessionInfo({ ...sessionInfo, name: e.target.value })
              }
            />
            <input
              required
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none"
              placeholder="Phone (880...)"
              onChange={(e) =>
                setSessionInfo({ ...sessionInfo, phoneNumber: e.target.value })
              }
            />
            <button
              disabled={isCreating}
              className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl"
            >
              Next Step
            </button>
          </form>
        </div>

        <div
          className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 ${step === 2 ? "bg-white border-indigo-500 shadow-xl" : "bg-slate-50 opacity-50 grayscale pointer-events-none"}`}
        >
          <h3 className="font-black flex items-center gap-2 mb-6 text-slate-800">
            <Link2 size={20} /> 2. Connect
          </h3>
          <p className="text-xs text-slate-500 mb-10 leading-relaxed font-medium">
            Activate server instance for QR code.
          </p>
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg"
          >
            {isConnecting ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              "Start Instance"
            )}
          </button>
        </div>

        <div
          className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 ${step === 3 ? "bg-white border-emerald-500 shadow-xl" : "bg-slate-50 opacity-50 grayscale pointer-events-none"}`}
        >
          <h3 className="font-black flex items-center gap-2 mb-6 text-slate-800">
            <QrCode size={20} /> 3. Scan QR
          </h3>
          <div className="aspect-square bg-slate-50 rounded-[2rem] flex items-center justify-center border-2 border-dashed border-slate-200 relative">
            {isConnected ? (
              <div className="flex flex-col items-center animate-in zoom-in duration-500">
                <CheckCircle2 size={60} className="text-emerald-500 mb-2" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  Successfully Linked
                </span>
              </div>
            ) : (
              renderQRCode()
            )}
          </div>
          {step === 3 && !isConnected && (
            <button
              onClick={() => refetch()}
              className="w-full mt-4 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest"
            >
              <RefreshCw
                size={12}
                className={isFetching ? "animate-spin" : ""}
              />{" "}
              {isFetching ? "Syncing..." : "Manual Refresh"}
            </button>
          )}
        </div>
      </section>

      {/* Active Session Status Card */}
      {sessionStatus && sessionStatus.status === "connected" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${sessionStatus.status === "connected" ? "bg-emerald-100" : "bg-yellow-100"}`}
            >
              {sessionStatus.status === "connected" ? (
                <CheckCircle2 className="text-emerald-600" size={28} />
              ) : (
                <RefreshCw className="text-yellow-600 animate-spin" size={28} />
              )}
            </div>
            <div>
              <h4 className="text-base font-black text-slate-800">
                {sessionStatus.name || "Active Session"}
              </h4>
              <p className="text-sm text-slate-500 font-medium">
                {sessionStatus.phone_number}
              </p>
              <span
                className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter ${sessionStatus.status === "connected" ? "bg-emerald-500 text-white" : "bg-yellow-500 text-white"}`}
              >
                {sessionStatus.status}
              </span>
            </div>
          </div>
          <button
            onClick={() => handleDeleteSession(getSafeId(sessionStatus))}
            disabled={isDeleting}
            className="p-4 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95 disabled:opacity-50 shadow-sm"
          >
            {isDeleting ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <X size={20} />
            )}
          </button>
        </div>
      )}

      <footer className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex items-center gap-6 shadow-2xl">
        <div className="bg-emerald-500/20 p-4 rounded-2xl text-emerald-400">
          <ShieldCheck size={32} />
        </div>
        <p className="text-slate-400 text-xs leading-relaxed max-w-xl">
          Everything is secure. Once linked, the session is stored encrypted on
          the server.
        </p>
      </footer>
    </div>
  );
};

export default Setting;
