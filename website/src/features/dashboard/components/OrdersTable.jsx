import { CreditCard } from 'lucide-react';
import { money } from '../utils/format.js';

export function OrdersTable({ rows, email }) {
  return (
    <div className="overflow-x-auto">
      <table>
        <thead>
          <tr>
            <th>Order / client</th>
            <th>Plan</th>
            <th>Billing</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => (
            <tr key={o.id}>
              <td>
                <strong>#{o.id}</strong>
                <small>{o.email || email}</small>
              </td>
              <td>{o.plan_name}</td>
              <td>{o.billing}</td>
              <td>{money(Number(o.amount))}</td>
              <td>
                <span
                  className={`inline-block rounded-[5px] px-[9px] py-[5px] text-[10px] capitalize ${o.status === 'pending' ? 'bg-[#fff6e5] text-[#a16207]' : 'bg-[#edf4ff] text-blue-600'}`}
                >
                  {o.status}
                </span>
              </td>
              <td>{new Date(o.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && (
        <div className="p-[42px]! text-center text-slate-400 [&_svg]:mx-auto [&_svg]:mb-3.5 [&_h3]:mb-2 [&_p]:text-xs">
          <CreditCard />
          <h3>No orders to show</h3>
          <p>New plan orders will appear here with their payment status.</p>
        </div>
      )}
    </div>
  );
}
