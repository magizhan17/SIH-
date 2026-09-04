import React, { useState } from 'react';
import { Download, Eye, Filter, Settings } from 'lucide-react';
import { reports } from '../data/reports';
import { StatusBadge } from '../components/ui/SharedComponents';
import type { ReportStatus } from '../types';
import { useApp } from '../context/AppContext';

type StatusFilter = 'all' | ReportStatus;

function getRiskColor(score: number) {
  if (score <= 30) return 'text-green-600 dark:text-green-400';
  if (score <= 60) return 'text-amber-600 dark:text-amber-400';
  if (score <= 80) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

function csvExport(data: typeof reports) {
  const headers = ['Report ID', 'Conveyor', 'Inspection Type', 'Damage Type', 'Risk Score', 'Date', 'Status'];
  const rows = data.map((r) =>
    [r.id, r.conveyorId, r.inspectionType, r.damageType, r.riskScore, r.date, r.status].join(',')
  );
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cbh-reports.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const { addToast, settingChanges } = useApp();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [conveyorFilter, setConveyorFilter] = useState('all');
  const [sortKey, setSortKey] = useState<keyof typeof reports[0]>('date');

  const filtered = reports
    .filter((r) => (statusFilter === 'all' || r.status === statusFilter))
    .filter((r) => (conveyorFilter === 'all' || r.conveyorId === conveyorFilter));

  const handleExport = () => {
    csvExport(filtered);
    addToast('success', `Exported ${filtered.length} reports as CSV.`);
  };

  const handleView = (id: string) => {
    addToast('info', `Viewing report ${id}. (Simulated — no PDF generated in demo mode)`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="section-title text-xl">Inspection & Maintenance Reports</h2>
          <p className="section-subtitle mt-1">View and export historical inspection and maintenance records.</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 btn-secondary text-xs"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* System Configuration Changes */}
      {settingChanges && settingChanges.length > 0 && (
        <div className="card p-4">
          <h3 className="section-title text-sm mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#6B7280] dark:text-[#A1A1AA]" />
            Recent Configuration Changes
          </h3>
          <div className="space-y-3">
            {settingChanges.map((change) => (
              <div key={change.id} className="flex justify-between items-center py-2 border-b border-[#E5E7EB] dark:border-[#292929] last:border-0 last:pb-0">
                <p className="text-sm text-[#111827] dark:text-white">{change.details}</p>
                <span className="text-xs text-[#6B7280] dark:text-[#A1A1AA]">{change.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-[#6B7280] dark:text-[#A1A1AA]" />
          <span className="text-xs text-[#6B7280] dark:text-[#A1A1AA]">Filter:</span>
        </div>
        {/* Conveyor */}
        <select
          value={conveyorFilter}
          onChange={(e) => setConveyorFilter(e.target.value)}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#292929] bg-white dark:bg-[#161616] text-[#111827] dark:text-white"
        >
          <option value="all">All Conveyors</option>
          {['CV-01', 'CV-02', 'CV-03', 'CV-04'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#292929] bg-white dark:bg-[#161616] text-[#111827] dark:text-white"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="reviewed">Reviewed</option>
          <option value="closed">Closed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#F7F8FA] dark:bg-[#111111] border-b border-[#E5E7EB] dark:border-[#292929]">
              <tr>
                {['Report ID', 'Conveyor', 'Inspection', 'Damage', 'Risk', 'Date', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-[#6B7280] dark:text-[#A1A1AA] font-semibold uppercase tracking-wide whitespace-nowrap text-[10px]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => (
                <tr
                  key={r.id}
                  className={`border-b border-[#E5E7EB] dark:border-[#292929] hover:bg-[#F7F8FA] dark:hover:bg-[#1a1a1a] transition-colors ${idx % 2 === 0 ? '' : 'bg-[#FAFAFA] dark:bg-[#0e0e0e]'}`}
                >
                  <td className="py-3 px-4 font-mono font-medium text-[#111827] dark:text-white">{r.id}</td>
                  <td className="py-3 px-4 text-[#6B7280] dark:text-[#A1A1AA]">{r.conveyorId}</td>
                  <td className="py-3 px-4 text-[#111827] dark:text-white">{r.inspectionType}</td>
                  <td className="py-3 px-4 text-[#6B7280] dark:text-[#A1A1AA]">{r.damageType}</td>
                  <td className={`py-3 px-4 font-bold ${getRiskColor(r.riskScore)}`}>{r.riskScore}</td>
                  <td className="py-3 px-4 text-[#6B7280] dark:text-[#A1A1AA] whitespace-nowrap">{r.date}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleView(r.id)}
                      className="flex items-center gap-1 btn-secondary text-[10px] py-1 px-2"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-[#E5E7EB] dark:border-[#292929] flex justify-between items-center">
          <span className="text-[11px] text-[#6B7280] dark:text-[#A1A1AA]">
            Showing {filtered.length} of {reports.length} reports
          </span>
        </div>
      </div>
    </div>
  );
}
