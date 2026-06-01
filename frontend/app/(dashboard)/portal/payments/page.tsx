'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { CreditCard, CheckCircle, Clock, XCircle } from 'lucide-react';

type Payment = {
  id: string;
  amount: number;
  payment_type: string;
  payment_method: string;
  transaction_id: string;
  payment_date: string;
  status: string;
  notes: string;
};

const statusIcon: Record<string, React.ElementType> = {
  completed: CheckCircle, pending: Clock, failed: XCircle, refunded: CheckCircle,
};
const statusColor: Record<string, string> = {
  completed: 'text-green-600 bg-green-50', pending: 'text-amber-600 bg-amber-50',
  failed: 'text-red-600 bg-red-50', refunded: 'text-blue-600 bg-blue-50',
};

export default function PortalPaymentsPage() {
  const { profile } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!profile) return;
      const { data: cust } = await supabase.from('customers').select('id').eq('user_id', profile.id).maybeSingle();
      if (!cust) { setLoading(false); return; }
      const { data } = await supabase.from('payments').select('*').eq('customer_id', cust.id).order('payment_date', { ascending: false });
      setPayments(data ?? []);
      setLoading(false);
    };
    load();
  }, [profile]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-[#c8851e] border-t-transparent rounded-full animate-spin" /></div>;
  }

  const totalPaid = payments.filter((p) => p.status === 'completed').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#1a1a1a]">Payment History</h1>
        <p className="text-[#6b6b6b] text-sm mt-1">{payments.length} transaction records</p>
      </div>

      {totalPaid > 0 && (
        <div className="bg-gradient-to-r from-[#0a1f0a] to-[#1a4a1a] rounded-2xl p-5 text-white flex items-center justify-between">
          <div>
            <div className="text-white/60 text-xs mb-1">Total Amount Paid</div>
            <div className="font-display text-3xl font-bold">₹{totalPaid.toLocaleString('en-IN')}</div>
          </div>
          <CreditCard className="w-12 h-12 text-[#c8851e]/30" />
        </div>
      )}

      {payments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#e8e0d8]">
          <CreditCard className="w-10 h-10 text-[#c8851e]/30 mx-auto mb-3" />
          <p className="text-[#6b6b6b] text-sm">No payment records found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => {
            const Icon = statusIcon[p.status] || CheckCircle;
            return (
              <div key={p.id} className="bg-white rounded-xl border border-[#e8e0d8] p-4 hover:shadow-sm transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusColor[p.status] || 'bg-gray-50 text-gray-600'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[#1a1a1a] font-semibold text-sm">₹{p.amount.toLocaleString('en-IN')}</div>
                    <div className="text-[#6b6b6b] text-xs capitalize">
                      {p.payment_type.replace('_', ' ')} · {p.payment_method.replace('_', ' ')}
                    </div>
                    {p.transaction_id && (
                      <div className="text-[#6b6b6b] text-[10px]">TXN: {p.transaction_id}</div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[#1a1a1a] text-xs font-medium">{p.payment_date}</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    p.status === 'completed' ? 'bg-green-100 text-green-700' :
                    p.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    p.status === 'refunded' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {p.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
