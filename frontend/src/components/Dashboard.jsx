import React, { useState } from 'react';
import ComplaintForm from './ComplaintForm';
import TicketCard from './TicketCard';
import { ArrowDownWideNarrow } from 'lucide-react';

const Dashboard = ({ tickets, fetchTickets, selectedDept, searchQuery }) => {
  const [sortBy, setSortBy] = useState('time_desc');

  const filteredTickets = tickets.filter(ticket => {
    const matchesDept = selectedDept === 'All' ? true : ticket.nlp_analysis.department_routing === selectedDept;
    
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesDept;

    const matchesText = ticket.ticket_info?.raw_text?.toLowerCase().includes(query);
    const matchesCategory = ticket.nlp_analysis?.category?.toLowerCase().includes(query);
    const matchesEmotion = ticket.nlp_analysis?.emotion?.toLowerCase().includes(query);
    const matchesPriority = ticket.nlp_analysis?.priority?.toLowerCase().includes(query);

    return matchesDept && (matchesText || matchesCategory || matchesEmotion || matchesPriority);
  });

  const priorityWeight = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
  
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (sortBy === 'priority') {
      const weightA = priorityWeight[a.nlp_analysis.priority] || 0;
      const weightB = priorityWeight[b.nlp_analysis.priority] || 0;
      return weightB - weightA;
    } 
    else if (sortBy === 'time_desc') {
      return new Date(b.ticket_info.created_at) - new Date(a.ticket_info.created_at);
    } 
    else if (sortBy === 'time_asc') {
      return new Date(a.ticket_info.created_at) - new Date(b.ticket_info.created_at);
    }
    return 0;
  });

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <section>
          <ComplaintForm onTicketCreated={fetchTickets} />
        </section>

        <section>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {selectedDept === 'All' ? 'All Complaints' : `${selectedDept} Queue`}
              </h2>
              <p className="text-sm text-slate-500">
                {sortedTickets.length} {sortedTickets.length === 1 ? 'ticket' : 'tickets'} found
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <ArrowDownWideNarrow className="w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-sm"
              >
                <option value="time_desc">Newest First</option>
                <option value="time_asc">Oldest First</option>
                <option value="priority">Highest Priority</option>
              </select>
            </div>
          </div>

          {sortedTickets.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center">
              <p className="text-sm font-medium text-slate-500">
                {searchQuery 
                  ? `No complaints found matching "${searchQuery}".`
                  : `No complaints found for ${selectedDept}.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedTickets.map((ticket) => (
                <TicketCard key={ticket._id} ticket={ticket} />
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
};

export default Dashboard;