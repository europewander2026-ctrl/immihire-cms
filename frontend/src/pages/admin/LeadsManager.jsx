import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';

const LeadsManager = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getLeads();
      setLeads(data);
    } catch (err) {
      setError('Failed to fetch leads. Ensure you have the correct admin token.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdating(id);
      await adminApi.updateLeadStatus(id, newStatus);
      setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
    } catch (err) {
      alert('Failed to update lead status.');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return <div className="p-10 flex justify-center text-gray-500">Loading leads...</div>;
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Inbox / Leads</h1>
        <p className="text-gray-500 text-sm mt-1">Manage consultation requests and form submissions.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-100">
          {error}
        </div>
      )}

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="p-4 pl-6 font-medium">Contact</th>
                <th className="p-4 font-medium">Subject / Destination</th>
                <th className="p-4 font-medium">Message</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 pr-6 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">No leads found.</td>
                </tr>
              ) : (
                leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4 pl-6 align-top">
                      <div className="font-bold text-gray-900">{lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.email}</div>
                      <div className="text-sm text-gray-400 mt-1">{lead.phone}</div>
                    </td>
                    <td className="p-4 align-top text-gray-800 font-medium">
                      {lead.subject || '-'}
                    </td>
                    <td className="p-4 align-top">
                      <p className="text-sm text-gray-600 line-clamp-3 max-w-md" title={lead.message}>
                        {lead.message || 'No message provided.'}
                      </p>
                    </td>
                    <td className="p-4 align-top text-sm text-gray-500 whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(lead.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="p-4 pr-6 align-top text-right">
                      <select 
                        value={lead.status || 'New'}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        disabled={updating === lead.id}
                        className={`text-sm rounded-full px-3 py-1 font-semibold border-0 outline-none cursor-pointer disabled:opacity-50
                          ${(lead.status === 'New' || !lead.status) ? 'bg-blue-50 text-blue-700' : ''}
                          ${lead.status === 'Contacted' ? 'bg-amber-50 text-amber-700' : ''}
                          ${lead.status === 'Closed' ? 'bg-green-50 text-green-700' : ''}
                        `}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                      </select>
                      {updating === lead.id && <div className="text-xs text-gray-400 mt-2"><i className="fa-solid fa-spinner fa-spin"></i> Saving...</div>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeadsManager;
