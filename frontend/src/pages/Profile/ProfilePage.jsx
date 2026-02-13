import React, { useState, useEffect } from "react";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContent";
import toast from "react-hot-toast";
import { User, Mail, Lock, Shield, UserCircle } from "lucide-react";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {data}= await authService.getProfile();
        setUsername(data.username);
        setEmail(data.email);
      }catch(error){
        toast.error("Failed to fetch profile information.");
        console.error(error);
      }finally{
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setPasswordLoading(true);
    try {
      await authService.changePassword({currentPassword, newPassword});
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }catch(error){
      toast.error(error.response?.data?.message || "Failed to update password.");
      console.error(error);
    }finally{
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }


  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-slate-50 to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30 p-8 shadow-sm">
        {/* Animated Backgrounds */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-indigo-200/30 dark:bg-indigo-900/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-violet-200/30 dark:bg-violet-900/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative flex items-start gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 shadow-lg">
            <UserCircle className="h-10 w-10 text-indigo-700 dark:text-indigo-300" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Profile Settings
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Manage your account information and security settings
            </p>
            <div className="mt-4 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur">
                <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span className="font-medium text-slate-900 dark:text-slate-100">{username}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur">
                <Mail className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                <span className="font-medium text-slate-900 dark:text-slate-100">{email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 pb-12">
        {/* User Information Section */}
        <div className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
          {/* Subtle gradient overlay */}
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-100/30 to-violet-100/30 dark:from-indigo-900/20 dark:to-violet-900/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-md">
                <User className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                User Information
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Username</label>
                <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/40">
                    <User className="h-5 w-5 text-indigo-700 dark:text-indigo-400" />
                  </div>
                  <p className="text-slate-900 dark:text-slate-100 font-medium text-lg">{username}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/40">
                    <Mail className="h-5 w-5 text-violet-700 dark:text-violet-400" />
                  </div>
                  <p className="text-slate-900 dark:text-slate-100 font-medium text-lg">{email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
          {/* Subtle gradient overlay */}
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-rose-100/30 to-orange-100/30 dark:from-rose-900/20 dark:to-orange-900/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 shadow-md">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Security Settings
              </h3>
            </div>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="w-full pl-12 pr-4 py-3 text-base bg-white dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-400 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="w-full pl-12 pr-4 py-3 text-base bg-white dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-400 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm New Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="w-full pl-12 pr-4 py-3 text-base bg-white dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-400 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
              </div>
              <div className="pt-4">
                <Button type="submit" disabled={passwordLoading} className="w-full">
                  {passwordLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
