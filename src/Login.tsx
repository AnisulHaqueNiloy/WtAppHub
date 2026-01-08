import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Mail, Lock, ArrowRight } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9] px-4">
      {/* Background Decorative Circles */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/40 rounded-full blur-[120px] -z-10" />

      <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 w-full max-w-[450px] border border-white/50">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200 mb-4 transition-transform hover:scale-110">
            <MessageSquare size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight text-center">
            Welcome Back
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Log in to your SenderPro account
          </p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none transition-all text-slate-700 placeholder:text-slate-300"
                placeholder="name@company.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400">
                Password
              </label>
              <span className="text-[10px] font-bold text-blue-600 cursor-pointer hover:underline">
                Forgot?
              </span>
            </div>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none transition-all text-slate-700 placeholder:text-slate-300"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Login Button */}
          <Link to={"/dashboard"} className="block pt-2">
            <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-blue-200 hover:shadow-blue-300 active:scale-[0.98] transition-all tracking-wide">
              SIGN IN <ArrowRight size={18} />
            </button>
          </Link>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm font-medium">
            New here?{" "}
            <Link
              to={"/"}
              className="text-blue-600 font-bold hover:underline underline-offset-4"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
