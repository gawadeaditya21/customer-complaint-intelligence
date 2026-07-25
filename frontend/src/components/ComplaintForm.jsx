import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

const ComplaintForm = ({ onTicketCreated }) => {
  const [newComplaint, setNewComplaint] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComplaint.trim()) return;
    
    setIsSubmitting(true);
    try {
      await fetch('http://127.0.0.1:8000/api/v1/analyze-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: `STU-${Math.floor(Math.random() * 90000) + 10000}`,
          raw_text: newComplaint
        })
      });
      setNewComplaint('');
      await onTicketCreated();
    } catch (error) {
      console.error("Error submitting ticket:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 mb-8 max-w-3xl mx-auto">
      <div className="flex flex-col space-y-1.5 mb-4">
        <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-slate-900" />
          Simulate Student Complaint
        </h3>
        <p className="text-sm text-slate-500">
          Enter a raw customer message to test the NLP routing engine.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={newComplaint}
          onChange={(e) => setNewComplaint(e.target.value)}
          placeholder="e.g., 'I was charged twice for the React course!'"
          className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2"
        >
          {isSubmitting ? 'Analyzing...' : 'Run Analysis'}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;