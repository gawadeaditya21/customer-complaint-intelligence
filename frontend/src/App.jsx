import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import { Loader2 } from 'lucide-react';

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState(''); // Search State

  const fetchTickets = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/tickets');
      const result = await response.json();
      setTickets(result.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          Initializing Intelligence Engine...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
        selectedDept={selectedDept}
        setSelectedDept={setSelectedDept}
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        
        <Dashboard 
          tickets={tickets} 
          fetchTickets={fetchTickets}
          selectedDept={selectedDept} 
          searchQuery={searchQuery}
        />
      </div>
      
    </div>
  );
};

export default App;