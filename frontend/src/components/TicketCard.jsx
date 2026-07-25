import React from 'react';
import { cn } from '../utils/cn';
import { Lightbulb, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

const TicketCard = ({ ticket }) => {
  const { ticket_info, nlp_analysis, ai_insight } = ticket;

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-600 text-white shadow-sm ring-1 ring-red-700';
      case 'High': return 'bg-orange-500 text-white shadow-sm ring-1 ring-orange-600';
      case 'Medium': return 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-700';
      default: return 'bg-slate-700 text-white shadow-sm ring-1 ring-slate-800';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Critical': return <AlertTriangle className="w-3.5 h-3.5 mr-1.5" strokeWidth={2.5} />;
      case 'High': return <AlertCircle className="w-3.5 h-3.5 mr-1.5" strokeWidth={2.5} />;
      default: return <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" strokeWidth={2.5} />;
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
      
      <div className="flex flex-col space-y-1.5 p-6 pb-4">
        <div className="flex justify-between items-start mb-3">
          <div className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-bold transition-colors", getPriorityStyles(nlp_analysis.priority))}>
            {getPriorityIcon(nlp_analysis.priority)}
            {nlp_analysis.priority}
          </div>
          <span className="inline-flex items-center rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold bg-slate-50 text-slate-600">
            {nlp_analysis.department_routing}
          </span>
        </div>
        <p className="text-sm font-medium text-slate-900 italic line-clamp-3 leading-relaxed">
          "{ticket_info.raw_text}"
        </p>
      </div>

      <div className="p-6 pt-0 grow">
        <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</span>
            <span className="text-sm font-semibold text-slate-800">{nlp_analysis.category}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detected Emotion</span>
            <span className="text-sm font-semibold text-slate-800 capitalize">{nlp_analysis.emotion}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center p-6 pt-0 mt-auto">
        <div className="w-full rounded-lg bg-blue-50/50 border border-blue-100/50 p-3.5 flex items-start gap-3">
          <Lightbulb className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <p className="text-xs font-semibold text-slate-700 leading-relaxed">
            {ai_insight.suggested_action}
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default TicketCard;