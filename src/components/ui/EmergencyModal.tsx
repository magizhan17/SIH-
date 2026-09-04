import React, { useState } from 'react';
import { AlertTriangle, X, CheckSquare, Square, Send, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function EmergencyModal() {
  const { isEmergencyModalOpen, closeEmergencyModal, sendEmergencyAlert, riskScore, maxCrackDepth, isDamageSimulated } = useApp();
  const [sent, setSent] = useState(false);
  const [recipients, setRecipients] = useState({
    controlRoom: true,
    maintenance: true,
    safety: true,
    supervisor: true,
  });

  if (!isEmergencyModalOpen) return null;

  const handleSend = () => {
    setSent(true);
    setTimeout(() => {
      sendEmergencyAlert();
      setSent(false);
    }, 1500);
  };

  const toggleRecipient = (key: keyof typeof recipients) => {
    setRecipients((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={closeEmergencyModal} />

      {/* Modal */}
      <div className="modal-enter relative w-full max-w-md bg-white dark:bg-[#161616] border border-[#E5E7EB] dark:border-[#292929] rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 px-5 py-4 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-white flex-shrink-0" />
          <div className="flex-1">
            <h2 className="text-white font-bold text-base">Emergency Notification</h2>
            <p className="text-red-100 text-xs">⚠ SIMULATION ONLY — No real alert will be sent</p>
          </div>
          <button onClick={closeEmergencyModal} className="text-red-100 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {sent ? (
            <div className="flex flex-col items-center py-6 gap-3">
              <CheckCircle className="w-14 h-14 text-green-500" />
              <p className="text-lg font-semibold text-[#111827] dark:text-white">Alert Sent Successfully</p>
              <p className="text-sm text-[#6B7280] dark:text-[#A1A1AA] text-center">
                All selected teams have been notified. (Simulated)
              </p>
            </div>
          ) : (
            <>
              {/* Alert summary */}
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
                  Critical conveyor belt damage has been detected.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#6B7280] dark:text-[#A1A1AA]">Conveyor:</span>
                    <span className="ml-1 font-semibold text-[#111827] dark:text-white">CV-04</span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] dark:text-[#A1A1AA]">Risk Score:</span>
                    <span className="ml-1 font-semibold text-red-600 dark:text-red-400">{riskScore}/100</span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] dark:text-[#A1A1AA]">Location:</span>
                    <span className="ml-1 font-semibold text-[#111827] dark:text-white">1240 m</span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] dark:text-[#A1A1AA]">Crack Depth:</span>
                    <span className="ml-1 font-semibold text-red-600 dark:text-red-400">{maxCrackDepth} mm</span>
                  </div>
                </div>
              </div>

              {/* Recipients */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280] dark:text-[#A1A1AA] mb-2">
                  Notify Recipients
                </p>
                <div className="space-y-2">
                  {(Object.entries(recipients) as [keyof typeof recipients, boolean][]).map(([key, checked]) => {
                    const labels: Record<string, string> = {
                      controlRoom: 'Control Room',
                      maintenance: 'Maintenance Team',
                      safety: 'Safety Team',
                      supervisor: 'Site Supervisor',
                    };
                    return (
                      <button
                        key={key}
                        onClick={() => toggleRecipient(key)}
                        className="flex items-center gap-2.5 w-full text-left text-sm text-[#111827] dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {checked ? (
                          <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-[#6B7280] dark:text-[#A1A1AA] flex-shrink-0" />
                        )}
                        {labels[key]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button onClick={closeEmergencyModal} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Send Emergency Alert
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
