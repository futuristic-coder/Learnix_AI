import React from 'react';
import {useAuth} from "../../context/AuthContent";
import {Bell, User, Menu} from "lucide-react";

const Header = ({toggleSidebar}) => {
    const {user} = useAuth();

  return (
    <header className="w-full bg-white/80 backdrop-blur border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className='flex items-center gap-4'>
        <button 
          onClick={toggleSidebar} 
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition"
        >
          <Menu className="h-6 w-6 text-slate-700" />
        </button>
        <h2 className="hidden md:block text-xl font-semibold text-slate-800">Welcome back!</h2>
      </div>
      
      <div className='flex items-center gap-4'>
        <button className="relative p-2 rounded-xl hover:bg-slate-100 transition">
          <Bell className="h-6 w-6 text-slate-600" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-amber-500 rounded-full"></span>
        </button>
        
        <div className='flex items-center gap-3 pl-4 border-l border-slate-200'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30'>
            <User className="h-5 w-5" strokeWidth={2} />          
          </div>
          <div className='hidden sm:block'>
            <p className='text-sm font-semibold text-slate-800'>{user?.username || 'User'}</p>
            <p className='text-xs text-slate-500'>{user?.email || 'user@example.com'}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
