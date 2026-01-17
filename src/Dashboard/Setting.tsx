import  { useState } from 'react';
// Tomar path onujayi route koro
import { toast } from 'react-hot-toast'; // Toast use korle dekhte pro lage
import { useTokenUpdateMutation } from '../redux/features/settings/settingApi';

const Setting = () => {
  const [waToken, setWaToken] = useState("");
  
  // RTK Query Mutation Hook
  const [updateToken, { isLoading }] = useTokenUpdateMutation();

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!waToken) {
      return toast.error("Please enter a token first!");
    }

    try {
      // Backend-e data pathano hochche
      await updateToken({ waToken }).unwrap();
      toast.success("API Key updated successfully! 🚀");
      setWaToken(""); // Form clear kora
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update settings");
      console.error("Update Error:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Wasender Configuration</h2>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Wasender API Key (Session Key)
          </label>
          <input
            type="password" // Password field dile token-ta hide thakbe
            value={waToken}
            onChange={(e) => setWaToken(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            placeholder="Paste your key here (from 🔑 icon)"
          />
          <p className="mt-2 text-xs text-gray-500 italic">
            * You can find this key by clicking the 🔑 icon next to your connected session in Wasender Dashboard.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-all ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
          }`}
        >
          {isLoading ? 'Saving...' : 'Update Settings'}
        </button>
      </form>

      <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <h4 className="text-sm font-bold text-yellow-800 uppercase">Security Note:</h4>
        <p className="text-sm text-yellow-700 mt-1">
          Never share your API key with anyone. This key allows our system to send messages via your WhatsApp session.
        </p>
      </div>
    </div>
  );
};

export default Setting;