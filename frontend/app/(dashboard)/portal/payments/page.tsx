'use client';

import { useEffect, useState } from 'react';
import { Download, FileText, TrendingUp, CreditCard, Calendar, CheckCircle, X, Printer } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

export default function PortalPaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<any[]>([]);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res1 = await fetch(`${API_URL}/investments/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data1 = await res1.json();
        if (data1.success) {
          setTotalInvestment(data1.data.reduce((sum: number, inv: any) => sum + (Number(inv.amount) || 0), 0));
        }
        
        const res2 = await fetch(`${API_URL}/payments/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data2 = await res2.json();
        if (data2.success) setPayments(data2.data);
      } catch (err) {
        console.error('Failed to load payment data:', err);
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

  const handleDownloadReceipt = (p: any) => {
    if (p.receipt_url) {
      window.open(p.receipt_url, '_blank');
      return;
    }
    setSelectedReceipt(p);
  };

  const totalPaid = payments.filter(p => p.status === 'COMPLETED').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const pendingAmount = payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + (Number(p.amount) || 0), 0) + Math.max(0, totalInvestment - totalPaid);

  const statCards = [
    { label: 'Total Investment', value: `₹${totalInvestment.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/20' },
    { label: 'Total Paid', value: `₹${totalPaid.toLocaleString('en-IN')}`, icon: CheckCircle, color: 'from-green-500/20 to-green-600/10', border: 'border-green-500/20' },
    { label: 'Pending Amount', value: `₹${pendingAmount.toLocaleString('en-IN')}`, icon: Calendar, color: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/20' },
    { label: 'Payment Status', value: pendingAmount > 0 ? 'Pending Dues' : 'On Track', icon: CreditCard, color: 'from-[#c8851e]/20 to-[#c8851e]/10', border: 'border-[#c8851e]/20' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#F7F0E4]">Payment History</h1>
        <p className="text-[#B8B8A8] text-sm mt-1">Track your installment payments and download receipts.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className={`bg-gradient-to-br ${card.color} border ${card.border} rounded-2xl p-5`}>
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-white/5">
                <card.icon className="w-4 h-4 text-white/70" />
              </div>
            </div>
            <div className="font-display text-2xl font-bold text-white mb-0.5">{card.value}</div>
            <div className="text-white/50 text-xs">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[rgba(18,55,42,0.35)] border border-[rgba(196,154,90,0.25)] rounded-[20px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 border-b border-white/5 text-[#B8B8A8] text-[11px] uppercase tracking-widest">
                <th className="p-5 font-medium">Date</th>
                <th className="p-5 font-medium">Transaction ID</th>
                <th className="p-5 font-medium">Amount</th>
                <th className="p-5 font-medium">Payment Mode</th>
                <th className="p-5 font-medium">Status</th>
                <th className="p-5 font-medium text-right">Receipt / Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {payments.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-white/30">No payments found</td></tr>
              ) : payments.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-5 text-[#F7F0E4] font-medium">{new Date(p.payment_date).toLocaleDateString('en-IN')}</td>
                  <td className="p-5 text-[#B8B8A8] font-mono text-xs">{p.transaction_id || '-'}</td>
                  <td className="p-5 text-[#F7F0E4] font-semibold">₹{Number(p.amount).toLocaleString('en-IN')}</td>
                  <td className="p-5 text-[#B8B8A8] capitalize">{p.payment_method?.replace('_', ' ')}</td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      p.status === 'COMPLETED' ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20' :
                      p.status === 'PENDING' ? 'bg-[#C49A5A]/10 text-[#C49A5A] border border-[#C49A5A]/20' :
                      'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    {p.status === 'COMPLETED' ? (
                      <button 
                        onClick={() => handleDownloadReceipt(p)}
                        className="inline-flex items-center gap-1.5 text-[#C49A5A] hover:text-[#F7F0E4] text-xs font-medium transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    ) : p.notes && p.notes.includes('http') ? (
                      <a href={p.notes} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[#B8B8A8] hover:text-[#F7F0E4] text-xs font-medium transition-colors">
                        <FileText className="w-3.5 h-3.5" /> View Proof
                      </a>
                    ) : (
                      <span className="text-white/20 text-xs">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm no-print">
          <div className="bg-[#141410] border border-[#C49A5A]/30 rounded-2xl w-full max-w-xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#C49A5A]" /> Payment Receipt
              </h2>
              <button 
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Content */}
            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6" id="printable-receipt">
              <div className="border border-[#C49A5A]/20 rounded-xl p-6 bg-gradient-to-b from-white/5 to-transparent space-y-6 print:border-gray-300 print:text-black print:bg-white">
                
                {/* Brand / Receipt Header */}
                <div className="text-center border-b border-white/10 pb-5 print:border-gray-200">
                  <h3 className="text-xl font-bold text-[#F7F0E4] print:text-black font-display">Chandhan Nilayam</h3>
                  <p className="text-[10px] text-[#C49A5A] uppercase tracking-widest mt-0.5 print:text-gray-500 font-semibold">Official Payment Receipt</p>
                </div>

                {/* Amount Section */}
                <div className="text-center bg-white/5 rounded-xl py-5 px-4 border border-white/5 print:bg-gray-50 print:border-gray-200">
                  <span className="text-xs text-white/50 print:text-gray-500 block">Amount Paid</span>
                  <span className="text-3xl font-extrabold text-[#C49A5A] print:text-black mt-1 block">
                    ₹{Number(selectedReceipt.amount).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Details Table */}
                <div className="space-y-3">
                  {[
                    { label: 'Transaction ID', value: selectedReceipt.transaction_id || 'N/A', mono: true },
                    { label: 'Payment Date', value: new Date(selectedReceipt.payment_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) },
                    { label: 'Payment Mode', value: selectedReceipt.payment_method?.replace('_', ' ') || 'N/A', capitalize: true },
                    { label: 'Payment Type', value: selectedReceipt.payment_type?.replace('_', ' ') || 'N/A', capitalize: true },
                    { label: 'Status', value: selectedReceipt.status, badge: true }
                  ].map((field, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 print:border-gray-200">
                      <span className="text-xs text-white/50 print:text-gray-500">{field.label}</span>
                      {field.badge ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 print:bg-green-50 print:text-green-700 print:border-green-200">
                          {field.value}
                        </span>
                      ) : (
                        <span className={`text-xs text-white font-medium print:text-black ${field.mono ? 'font-mono' : ''} ${field.capitalize ? 'capitalize' : ''}`}>
                          {field.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer Notes */}
                <div className="text-center border-t border-white/5 pt-5 text-[10px] text-white/40 leading-relaxed print:border-gray-200 print:text-gray-500">
                  Thank you for your investment with Chandhan Nilayam Investments.<br />
                  This is a system generated receipt and does not require a signature.
                </div>

              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex gap-3 p-5 border-t border-white/10 bg-black/20 justify-end">
              <button 
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg text-sm bg-[#C49A5A] hover:bg-[#A96618] text-white font-medium flex items-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS for Print Mode */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          /* Hide everything except the receipt */
          body * {
            visibility: hidden !important;
          }
          #printable-receipt, #printable-receipt * {
            visibility: visible !important;
          }
          #printable-receipt {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
          }
          /* Ensure text and tables render well on white paper */
          #printable-receipt .print\\:text-black {
            color: black !important;
          }
          #printable-receipt .print\\:border-gray-300 {
            border-color: #d1d5db !important;
          }
          #printable-receipt .print\\:border-gray-200 {
            border-color: #e5e7eb !important;
          }
          #printable-receipt .print\\:bg-white {
            background-color: white !important;
          }
          #printable-receipt .print\\:bg-gray-55 {
            background-color: #f9fafb !important;
          }
          #printable-receipt .print\\:text-gray-500 {
            color: #6b7280 !important;
          }
          #printable-receipt .print\\:bg-green-50 {
            background-color: #f0fdf4 !important;
          }
          #printable-receipt .print\\:text-green-700 {
            color: #15803d !important;
          }
          #printable-receipt .print\\:border-green-200 {
            border-color: #bbf7d0 !important;
          }
        }
      `}} />
    </div>
  );
}
