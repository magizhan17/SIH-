import { v4 as uuidv4 } from 'uuid';
import { getState } from '../models/stateModel';
import { createAlert, getAlerts } from '../models/alertModel';

export const evaluateAlerts = (conveyorId: string) => {
  const state = getState(conveyorId);
  if (!state) return;
  
  if (state.riskLevel === 'critical' || state.riskScore! >= 81) {
    // Check if we already have an unacknowledged critical alert in the last 5 mins
    const recentAlerts = getAlerts(conveyorId).filter(a => a.severity === 'critical' && !a.acknowledged);
    const fiveMinsAgo = new Date(Date.now() - 5 * 60000);
    
    const hasRecent = recentAlerts.some(a => new Date(a.timestamp) > fiveMinsAgo);
    
    if (!hasRecent) {
      const alert = {
        id: `ALT-${uuidv4().substring(0, 8).toUpperCase()}`,
        conveyorId,
        severity: 'critical' as const,
        title: 'Critical Risk Level Detected',
        message: `Risk score has reached ${state.riskScore} (Critical). Immediate inspection required.`,
        timestamp: new Date().toISOString(),
        acknowledged: false,
        category: 'System'
      };
      createAlert(alert);
      return alert;
    }
  }
  return null;
};
