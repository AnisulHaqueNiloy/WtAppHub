import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useRegisterMutation } from "./redux/features/auth/authAPi";

 // Update path if needed

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [register, { isLoading, error }] = useRegisterMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      }).unwrap(); // unwrap handles errors nicely
      console.log("User registered successfully");
      navigate("/login"); // Redirect to login after success
    } catch (err:any) {
      console.error("Registration failed:", err?.data?.message || err);
      alert(err?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9] px-4 py-10 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/30 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/30 rounded-full blur-[120px] -z-10" />

      <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 w-full max-w-[500px] border border-white/50">
        {/* Logo & Welcome */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200 mb-4">
            <MessageSquare size={28} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight text-center">
            Join BulkSender
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium text-center">
            Create an account to start your first campaign
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Full Name
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                name="fullName"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none transition-all text-slate-700 placeholder:text-slate-300 text-sm"
                placeholder="Enter your name"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                name="email"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none transition-all text-slate-700 placeholder:text-slate-300 text-sm"
                placeholder="name@company.com"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none transition-all text-slate-700 placeholder:text-slate-300 text-sm"
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Confirm
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <ShieldCheck size={18} />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none transition-all text-slate-700 placeholder:text-slate-300 text-sm"
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2 px-1">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              id="terms"
              required
            />
            <label
              htmlFor="terms"
              className="text-xs text-slate-500 font-medium"
            >
              I agree to the{" "}
              <span className="text-blue-600 hover:underline cursor-pointer">
                Terms & Conditions
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-blue-200 hover:shadow-blue-300 active:scale-[0.98] transition-all tracking-wide mt-2 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "CREATE FREE ACCOUNT"}{" "}
            <ArrowRight size={18} />
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">
              {(error as any)?.data?.message || "Something went wrong"}
            </p>
          )}
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-slate-500 text-sm font-medium">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-black hover:underline underline-offset-4 ml-1"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
