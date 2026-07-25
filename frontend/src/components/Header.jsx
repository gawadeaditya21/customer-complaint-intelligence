import React from 'react';
import { Search, Globe2, X } from 'lucide-react';

const Header = ({ searchQuery, setSearchQuery }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-30">
      <div className="flex items-center gap-2">
        <Globe2 className="w-6 h-6 text-blue-600 shrink-0" />
        <span className="font-bold text-slate-900 tracking-tight text-lg truncate">
          LearnSphere
        </span>
      </div>

      <div className="flex items-center w-72 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
        <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tickets..." 
          className="bg-transparent border-none outline-none text-sm text-slate-700 w-full placeholder-slate-400"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="text-slate-400 hover:text-slate-600 ml-1 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      
    </header>
  );
};

export default Header;