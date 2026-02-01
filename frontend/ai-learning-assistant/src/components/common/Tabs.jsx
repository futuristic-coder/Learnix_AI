import React from "react";

const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2">
        <nav className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => onTabChange(tab.name)}
              className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.name
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <span className="relative z-10">{tab.label}</span>

              {activeTab === tab.name && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-10" />
              )}
              {activeTab === tab.name && (
                <div className="absolute -bottom-1 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="">
        {tabs.map((tab) => {
          if (tab.name === activeTab) {
            return (
              <div key={tab.name} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                {tab.content}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Tabs;
