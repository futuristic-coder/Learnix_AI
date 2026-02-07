import React from 'react';
import {useAuth} from "../../context/AuthContent";
import {useTheme} from "../../context/ThemeContext";
import {User, Menu, Moon, Sun} from "lucide-react";

const Header = ({toggleSidebar}) => {
    const {user} = useAuth();
    const {isDark, toggleTheme} = useTheme();

  return (
    <header className="w-full bg-slate-50/80 dark:bg-slate-950/70 backdrop-blur border-b border-slate-200/70 dark:border-slate-800 px-6 py-3 flex items-center justify-between">
      <div className='flex items-center gap-3'>
        <button 
          onClick={toggleSidebar} 
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <Menu className="h-6 w-6 text-slate-700 dark:text-slate-300" />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-700">
            <img src="/ai.png" alt="Learnix AI" className="h-6 w-6 rounded-md" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Learnix AI</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Welcome back</p>
          </div>
        </div>
      </div>
      
      <div className='flex items-center gap-3'>
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <Sun className="h-6 w-6 text-amber-500" />
          ) : (
            <Moon className="h-6 w-6 text-slate-600" />
          )}
        </button>

        <div className='flex items-center gap-3 pl-3 border-l border-slate-200/70 dark:border-slate-700'>
          <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'>
            <User className="h-5 w-5" strokeWidth={2} />          
          </div>
          <div className='hidden sm:block'>
            <p className='text-sm font-semibold text-slate-800 dark:text-slate-100'>{user?.username || 'User'}</p>
            <p className='text-xs text-slate-500 dark:text-slate-400'>{user?.email || 'user@example.com'}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
