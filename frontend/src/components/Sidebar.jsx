import React from 'react';
import { 
  LayoutDashboard, MonitorSmartphone, CircleDollarSign, 
  Code2, FileText, GraduationCap, Menu 
} from 'lucide-react';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, selectedDept, setSelectedDept }) => {
  const departmentConfig = [
    { name: 'IT Support', icon: <MonitorSmartphone className="w-4 h-4" /> },
    { name: 'Finance', icon: <CircleDollarSign className="w-4 h-4" /> },
    { name: 'Engineering', icon: <Code2 className="w-4 h-4" /> },
    { name: 'Content Team', icon: <FileText className="w-4 h-4" /> },
    { name: 'Student Success', icon: <GraduationCap className="w-4 h-4" /> }
  ];

  return (
    <aside 
      className={`${
        isSidebarOpen ? 'w-64' : 'w-16'
      } transition-all duration-300 ease-in-out bg-slate-50 border-r border-slate-200 text-slate-700 flex flex-col h-full shrink-0 z-40`}
    >
      <div className="h-16 flex items-center px-4 shrink-0">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 rounded-md hover:bg-slate-200 transition-colors text-slate-600 shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 py-2 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
        <NavItem 
          icon={<LayoutDashboard className="w-5 h-5" />} 
          label="All Complaints" 
          isOpen={isSidebarOpen} 
          active={selectedDept === 'All'} 
          onClick={() => setSelectedDept('All')} 
        />
        
        {isSidebarOpen && (
          <div className="mt-8 mb-2 px-3 animate-in fade-in">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Departments
            </p>
          </div>
        )}
        
        <div className="space-y-1">
          {departmentConfig.map((dept) => (
            <NavItem 
              key={dept.name}
              icon={dept.icon} 
              label={dept.name} 
              isOpen={isSidebarOpen} 
              active={selectedDept === dept.name}
              onClick={() => setSelectedDept(dept.name)}
              isSubItem
            />
          ))}
        </div>
      </nav>
    </aside>
  );
};

const NavItem = ({ icon, label, isOpen, active, onClick, isSubItem }) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors overflow-hidden ${
        active 
          ? 'bg-blue-100/60 text-blue-700 font-semibold shadow-sm' 
          : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 font-medium'
      } ${!isOpen ? 'justify-center' : ''}`}
      title={!isOpen ? label : undefined}
    >
      <div className={`shrink-0 ${active ? 'text-blue-700' : 'text-slate-500'}`}>
        {icon}
      </div>
      {isOpen && (
        <span className={`text-sm whitespace-nowrap ${isSubItem ? 'text-[13px]' : ''}`}>
          {label}
        </span>
      )}
    </button>
  );
};

export default Sidebar;