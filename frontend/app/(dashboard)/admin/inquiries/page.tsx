'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Search, Filter, ArrowUpRight, Mail, Phone, Calendar, User, Clock, CheckCircle, Eye, X } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

type Inquiry = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  investment_interest: string;
  budget_range: string;
  plot_size: string;
  message: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const fetchInquiries = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/inquiries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setInquiries(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch inquiries');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error while fetching inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/inquiries/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Inquiry marked as ${newStatus}`);
        setInquiries(inquiries.map(inc => inc.id === id ? { ...inc, status: newStatus } : inc));
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const filteredInquiries = inquiries.filter(inc => 
    inc.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inc.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#C49A5A]/20 pb-6">
        <div>
          <h1 className="font-display text-[2rem] font-bold text-[#F8F5EE] tracking-tight flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-[#C49A5A]" />
            Inquiries & Leads
          </h1>
          <p className="text-[#A8B5AA] text-[15px] mt-1.5 font-medium">Manage prospective investor inquiries and communications.</p>
        </div>
      </div>

      <div className="bg-[#101A13] border border-[#C49A5A]/30 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-[#C49A5A]/20 bg-[#121F17] flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5AA]" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#08120D] border border-[#C49A5A]/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F8F5EE] placeholder-[#A8B5AA] focus:outline-none focus:border-[#C49A5A] transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#C49A5A] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 rounded-full bg-[#121F17] border border-[#C49A5A]/20 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-[#A8B5AA]/50" />
              </div>
              <h3 className="text-[#F8F5EE] font-bold text-lg mb-1">No Inquiries Found</h3>
              <p className="text-[#A8B5AA] text-sm">There are no inquiries matching your search.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0B1510] text-[#A8B5AA] font-semibold text-xs uppercase tracking-wider border-b border-[#C49A5A]/20">
                <tr>
                  <th className="px-6 py-4 rounded-tl-[20px]">Prospect Info</th>
                  <th className="px-6 py-4">Investment Interest</th>
                  <th className="px-6 py-4">Budget & Size</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 rounded-tr-[20px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C49A5A]/10 text-[#F8F5EE]">
                {filteredInquiries.map((inc) => (
                  <tr key={inc.id} className="hover:bg-[#121F17] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#F8F5EE] text-base mb-1 group-hover:text-[#C49A5A] transition-colors flex items-center gap-2">
                        {inc.full_name}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#A8B5AA]">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {inc.email}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {inc.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-[#A8B5AA]/70 mt-1.5 uppercase tracking-wide">
                        <Calendar className="w-3 h-3" /> 
                        {new Date(inc.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{inc.investment_interest}</div>
                      {inc.message && (
                        <div className="text-xs text-[#A8B5AA] mt-1 line-clamp-2 max-w-[250px] italic">"{inc.message}"</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#D9B36D]">{inc.budget_range}</div>
                      <div className="text-xs text-[#A8B5AA] mt-0.5">{inc.plot_size}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                        inc.status === 'NEW' ? 'bg-[#C49A5A]/10 text-[#C49A5A] border-[#C49A5A]/30 shadow-[0_0_10px_rgba(196,154,90,0.2)]' :
                        inc.status === 'CONTACTED' ? 'bg-[#123F25] text-[#22C55E] border-[#22C55E]/30' :
                        'bg-[#08120D] text-[#A8B5AA] border-[#A8B5AA]/30'
                      }`}>
                        {inc.status === 'NEW' ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                        {inc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {inc.status === 'NEW' && (
                        <button
                          onClick={() => handleStatusUpdate(inc.id, 'CONTACTED')}
                          className="text-xs font-semibold text-[#22C55E] hover:text-white bg-[#22C55E]/10 hover:bg-[#22C55E] border border-[#22C55E]/30 px-3 py-1.5 rounded-lg transition-all"
                        >
                          Mark Contacted
                        </button>
                      )}
                      {inc.status === 'CONTACTED' && (
                        <button
                          onClick={() => handleStatusUpdate(inc.id, 'CLOSED')}
                          className="text-xs font-semibold text-[#A8B5AA] hover:text-white bg-[#08120D] hover:bg-gray-600 border border-[#A8B5AA]/30 px-3 py-1.5 rounded-lg transition-all"
                        >
                          Mark Closed
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedInquiry(inc)}
                        className="text-xs font-semibold text-[#C49A5A] hover:text-white bg-[#C49A5A]/10 hover:bg-[#C49A5A] border border-[#C49A5A]/30 px-3 py-1.5 rounded-lg transition-all ml-2"
                      >
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* View Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#101A13] border border-[#C49A5A]/30 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#C49A5A]/20 bg-[#121F17] rounded-t-2xl">
              <h2 className="text-[#F8F5EE] text-xl font-bold font-display flex items-center gap-2">
                <User className="w-5 h-5 text-[#C49A5A]" />
                Inquiry Details
              </h2>
              <button 
                onClick={() => setSelectedInquiry(null)}
                className="text-[#A8B5AA] hover:text-white bg-[#08120D] hover:bg-[#C49A5A]/20 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
              
              {/* Profile Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#08120D] p-5 rounded-xl border border-[#C49A5A]/10">
                <div>
                  <h3 className="text-xl font-bold text-[#F8F5EE] mb-1">{selectedInquiry.full_name}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[#A8B5AA]">
                    <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-[#C49A5A]" /> {selectedInquiry.email}</span>
                    <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-[#C49A5A]" /> {selectedInquiry.phone}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#A8B5AA] uppercase tracking-wider mb-1">Status</div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    selectedInquiry.status === 'NEW' ? 'bg-[#C49A5A]/10 text-[#C49A5A] border-[#C49A5A]/30' :
                    selectedInquiry.status === 'CONTACTED' ? 'bg-[#123F25] text-[#22C55E] border-[#22C55E]/30' :
                    'bg-[#08120D] text-[#A8B5AA] border-[#A8B5AA]/30'
                  }`}>
                    {selectedInquiry.status}
                  </span>
                </div>
              </div>

              {/* Investment Criteria */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#121F17] p-5 rounded-xl border border-[#C49A5A]/10">
                  <div className="text-xs text-[#A8B5AA] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ArrowUpRight className="w-4 h-4 text-[#C49A5A]" /> Investment Interest
                  </div>
                  <div className="text-[#F8F5EE] font-medium">{selectedInquiry.investment_interest}</div>
                </div>
                
                <div className="bg-[#121F17] p-5 rounded-xl border border-[#C49A5A]/10">
                  <div className="text-xs text-[#A8B5AA] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Filter className="w-4 h-4 text-[#C49A5A]" /> Budget & Plot Size
                  </div>
                  <div className="text-[#D9B36D] font-bold mb-0.5">{selectedInquiry.budget_range}</div>
                  <div className="text-[#F8F5EE] text-sm">{selectedInquiry.plot_size}</div>
                </div>
              </div>

              {/* Message */}
              <div className="bg-[#121F17] p-5 rounded-xl border border-[#C49A5A]/10">
                <div className="text-xs text-[#A8B5AA] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#C49A5A]" /> Message / Questions
                </div>
                {selectedInquiry.message ? (
                  <p className="text-[#F8F5EE] text-sm leading-relaxed whitespace-pre-wrap italic">
                    "{selectedInquiry.message}"
                  </p>
                ) : (
                  <p className="text-[#A8B5AA] text-sm italic">No additional message provided.</p>
                )}
              </div>

              {/* Metadata */}
              <div className="flex justify-between items-center text-xs text-[#A8B5AA] mt-2 px-2 border-t border-[#C49A5A]/10 pt-4">
                <span>Inquiry ID: {selectedInquiry.id}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Submitted on {new Date(selectedInquiry.created_at).toLocaleString()}
                </span>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-[#C49A5A]/20 bg-[#121F17] rounded-b-2xl flex justify-end gap-3">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-5 py-2.5 rounded-xl border border-[#C49A5A]/30 text-[#F8F5EE] font-semibold hover:bg-[#C49A5A]/10 transition-colors text-sm"
              >
                Close
              </button>
              {selectedInquiry.status === 'NEW' && (
                <button
                  onClick={() => {
                    handleStatusUpdate(selectedInquiry.id, 'CONTACTED');
                    setSelectedInquiry(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#22C55E] text-[#0B1510] font-bold hover:bg-[#22C55E]/90 transition-colors text-sm"
                >
                  Mark as Contacted
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
