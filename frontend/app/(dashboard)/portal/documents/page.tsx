'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { FileText, Download, ExternalLink } from 'lucide-react';

type Document = {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  category: string;
  created_at: string;
};

const categoryColors: Record<string, string> = {
  title_deed: 'bg-blue-100 text-blue-700',
  survey: 'bg-green-100 text-green-700',
  investment_contract: 'bg-[#fdf3e0] text-[#c8851e]',
  payment_receipt: 'bg-emerald-100 text-emerald-700',
  plantation_report: 'bg-lime-100 text-lime-700',
  legal: 'bg-red-100 text-red-700',
  general: 'bg-gray-100 text-gray-600',
};

export default function PortalDocumentsPage() {
  const { profile } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!profile) return;
      const { data: cust } = await supabase.from('customers').select('id').eq('user_id', profile.id).maybeSingle();
      if (!cust) { setLoading(false); return; }
      const { data } = await supabase.from('documents').select('*').eq('customer_id', cust.id).order('created_at', { ascending: false });
      setDocuments(data ?? []);
      setLoading(false);
    };
    load();
  }, [profile]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-[#c8851e] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#1a1a1a]">Documents</h1>
        <p className="text-[#6b6b6b] text-sm mt-1">{documents.length} documents available</p>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#e8e0d8]">
          <FileText className="w-10 h-10 text-[#c8851e]/30 mx-auto mb-3" />
          <p className="text-[#6b6b6b] text-sm">No documents available yet. Your advisor will upload them here.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl border border-[#e8e0d8] p-5 hover:shadow-md transition-all hover:border-[#c8851e]/30 group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#fdf3e0] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-[#c8851e]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-[#1a1a1a] text-sm">{doc.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 capitalize ${categoryColors[doc.category] || 'bg-gray-100 text-gray-600'}`}>
                      {doc.category.replace('_', ' ')}
                    </span>
                  </div>
                  {doc.description && <p className="text-[#6b6b6b] text-xs mb-2 leading-relaxed">{doc.description}</p>}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[#6b6b6b] text-[10px]">
                      {new Date(doc.created_at).toLocaleDateString('en-IN')}
                    </span>
                    <span className="text-[#6b6b6b] text-[10px] uppercase">{doc.file_type}</span>
                    {doc.file_url && (
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#c8851e] text-xs hover:underline ml-auto">
                        <ExternalLink className="w-3 h-3" /> Open
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
