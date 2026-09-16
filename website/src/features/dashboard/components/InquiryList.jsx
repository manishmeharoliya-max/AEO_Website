import { useEffect, useState } from 'react';
import { api } from '../../../lib/api.js';

export function InquiryList() {
  const [inquiries, setInquiries] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    api('/inquiries', { signal: controller.signal })
      .then(setInquiries)
      .catch(failure => {
        if (!controller.signal.aborted) setError(failure.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);

  if (loading) return <p role="status">Loading inquiries…</p>;
  if (error) {
    return <div><p role="alert" className="text-red-700">{error}</p><button className="mt-3 text-blue-600" onClick={() => setAttempt(value => value + 1)}>Retry</button></div>;
  }
  return (
    <section aria-label="Client inquiries" className="grid gap-4">
      <h2>Latest inquiries</h2>
      <p>Showing the latest 200 contact and audit requests.</p>
      {!inquiries.length && <p>No inquiries have arrived yet.</p>}
      {inquiries.map(inquiry => (
        <article key={inquiry.id} className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div><h3>{inquiry.details.name}</h3><p>{inquiry.details.email}</p></div>
            <span className="rounded-md bg-blue-50 px-3 py-1 text-xs text-blue-700">{inquiry.type} · #{inquiry.id}</span>
          </div>
          <dl className="grid gap-3 sm:grid-cols-2">
            {Object.entries(inquiry.details).filter(([key, value]) => value && !['name', 'email'].includes(key)).map(([key, value]) => (
              <div key={key} className={key === 'message' ? 'sm:col-span-2' : ''}>
                <dt className="text-xs font-semibold capitalize text-slate-500">{key}</dt>
                <dd className="mt-1 whitespace-pre-wrap break-words text-sm">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-xs!">Received {new Date(inquiry.created_at).toLocaleString()}</p>
        </article>
      ))}
    </section>
  );
}
