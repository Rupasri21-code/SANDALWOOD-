'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { FileText, ExternalLink, Download } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function PortalDocumentsPage() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/documents/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setDocuments(data.data);
        }
      } catch (err) {
        console.error('Failed to load documents:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-[#C49A5A] border-t-transparent rounded-full animate-spin" /></div>;
  }

  const categoryMap: Record<string, string> = {
    title_deed: 'Land Documents',
    survey: 'Land Documents',
    investment_contract: 'Investment Documents',
    payment_receipt: 'Payment Receipts',
    plantation_report: 'Reports',
    legal: 'KYC',
    general: 'Reports',
  };

  const categories = ['All', 'Land Documents', 'Investment Documents', 'Payment Receipts', 'Reports', 'KYC'];
  
  const filteredDocs = filter === 'All' 
    ? documents 
    : documents.filter(d => categoryMap[d.category] === filter || (d.category === 'general' && filter === 'Reports'));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#F7F0E4]">Documents</h1>
        <p className="text-[#B8B8A8] text-sm mt-1">Secure vault for all your investment and land related files.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors border ${
              filter === cat 
                ? 'bg-[#C49A5A] text-[#10140E] border-[#C49A5A]' 
                : 'bg-[rgba(18,55,42,0.35)] text-[#B8B8A8] border-[rgba(196,154,90,0.25)] hover:bg-[#12372A] hover:text-[#F7F0E4]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredDocs.length === 0 ? (
        <div className="bg-[rgba(18,55,42,0.35)] border border-[rgba(196,154,90,0.25)] rounded-[20px] p-12 flex flex-col items-center justify-center text-center">
          <FileText className="w-12 h-12 text-[#C49A5A]/30 mb-4" />
          <h3 className="text-[#F7F0E4] font-medium mb-1">No documents available yet.</h3>
          <p className="text-[#B8B8A8] text-sm">Your advisor will upload them here.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="bg-[rgba(18,55,42,0.35)] border border-[rgba(196,154,90,0.25)] rounded-[20px] p-5 flex items-start gap-4 hover:border-[rgba(196,154,90,0.4)] hover:bg-[#12372A]/50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-black/30 border border-[#C49A5A]/20 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-[#C49A5A]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-[#F7F0E4] font-semibold text-sm truncate">{doc.title}</h3>
                </div>
                <div className="mb-3">
                  <span className="text-[9px] px-2 py-0.5 rounded-sm bg-[#C49A5A]/10 text-[#C49A5A] border border-[#C49A5A]/20 font-bold uppercase tracking-widest">
                    {categoryMap[doc.category] || doc.category?.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="text-[#B8B8A8] text-[10px] flex items-center gap-2">
                    <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                    <span className="uppercase">{doc.file_type}</span>
                  </div>
                  {doc.file_url && (
                    <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <a href={doc.file_url} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center hover:bg-[#C49A5A]/20 hover:text-[#C49A5A] text-[#B8B8A8] transition-colors border border-white/5">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <a href={doc.file_url} target="_blank" rel="noreferrer" download className="w-7 h-7 rounded-lg bg-[#C49A5A]/10 flex items-center justify-center hover:bg-[#C49A5A] hover:text-[#10140E] text-[#C49A5A] transition-colors border border-[#C49A5A]/20">
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
