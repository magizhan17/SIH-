import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Alert, SystemSettings, SettingChangeLog } from '../types';
import { api } from '../services/api';

// Fallback initial data in case backend is offline on first load
import { getSensorsNormal } from '../data/sensors';
import { alerts as initialAlerts } from '../data/alerts';
import { damages } from '../data/damages';
import { laserScans } from '../data/laserScans';
import { predictions } from '../data/predictions';

export interface ToastNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
}

interface AppState {
  selectedConveyor: string;
  isDamageSimulated: boolean;
  isEmergencyModalOpen: boolean;
  alerts: Alert[];
  damages: typeof damages;
  laserScans: typeof laserScans;
  currentScan: typeof laserScans[0];
  predictions: typeof predictions;
  sensors: ReturnType<typeof getSensorsNormal>;
  riskScore: number;
  beltHealth: number;
  maxCrackDepth: number;
  estimatedRemainingDays: number;
  toasts: ToastNotification[];
  settings: SystemSettings;
  emergencyActionsDone: {
    maintenance: boolean;
    controlRoom: boolean;
  };
  isBackendConnected: boolean;
  settingChanges: SettingChangeLog[];
}

interface AppContextValue extends AppState {
  setSelectedConveyor: (id: string) => void;
  simulateDamage: () => Promise<void>;
  resetSimulation: () => Promise<void>;
  openEmergencyModal: () => void;
  closeEmergencyModal: () => void;
  acknowledgeAlert: (id: string) => Promise<void>;
  addToast: (type: ToastNotification['type'], message: string) => void;
  removeToast: (id: string) => void;
  updateSettings: (settings: Partial<SystemSettings>) => Promise<void>;
  notifyMaintenance: () => void;
  notifyControlRoom: () => void;
  sendEmergencyAlert: () => Promise<void>;
}

const defaultSettings: SystemSettings = {
  warningRiskScore: 60, criticalRiskScore: 80, crackDepthWarning: 2.0, crackDepthCritical: 4.0,
  vibrationWarning: 5.0, vibrationCritical: 8.0, temperatureWarning: 70, temperatureCritical: 90,
  tensionWarning: 90, tensionCritical: 110,
};

const AppContext = createContext<AppContextValue | null>(null);

let toastCounter = 0;

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedConveyor, setSelectedConveyor] = useState('CV-04');
  const [isDamageSimulated, setIsDamageSimulated] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  
  const [alertList, setAlertList] = useState<Alert[]>(initialAlerts);
  const [damageList, setDamageList] = useState(damages);
  const [scanList, setScanList] = useState(laserScans);
  const [currentScan, setCurrentScan] = useState(laserScans[0]);
  const [predictionList, setPredictionList] = useState(predictions);
  const [sensors, setSensors] = useState(getSensorsNormal());
  
  const [riskScore, setRiskScore] = useState(72);
  const [beltHealth, setBeltHealth] = useState(68);
  const [maxCrackDepth, setMaxCrackDepth] = useState(3.2);
  const [estimatedRemainingDays, setEstimatedRemainingDays] = useState(18);
  
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [emergencyActionsDone, setEmergencyActionsDone] = useState({ maintenance: false, controlRoom: false });
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [settingChanges, setSettingChanges] = useState<SettingChangeLog[]>([]);

  const addToast = useCallback((type: ToastNotification['type'], message: string) => {
    const id = `toast-${toastCounter++}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  // Fetch initial data from backend
  const fetchInitialData = useCallback(async () => {
    try {
      const [apiAlerts, apiScans, apiDamages, apiPrediction, apiSettings, apiSensors] = await Promise.all([
        api.getAlerts(selectedConveyor),
        api.getLaserScans(selectedConveyor),
        api.getDamages(selectedConveyor),
        api.getPrediction(selectedConveyor),
        api.getSettings(),
        api.getLatestSensors(selectedConveyor)
      ]);

      setAlertList(apiAlerts);
      setScanList(apiScans);
      if (apiScans.length > 0) setCurrentScan(apiScans[0]);
      setDamageList(apiDamages);
      setPredictionList([apiPrediction]);
      setSettings(apiSettings);
      setSensors(apiSensors);
      setIsBackendConnected(true);
    } catch (e) {
      console.warn("Backend offline, using fallback mock data.");
      setIsBackendConnected(false);
    }
  }, [selectedConveyor]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // WebSocket Connection
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      setIsBackendConnected(true);
      ws.send(JSON.stringify({ type: 'SUBSCRIBE', conveyorId: selectedConveyor }));
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'SENSOR_UPDATE') {
          const { sensors: newSensors, riskScore: newRisk, beltHealth: newHealth } = msg.data;
          setSensors(newSensors);
          setRiskScore(newRisk);
          setBeltHealth(newHealth);
        } else if (msg.type === 'ALERT') {
          setAlertList(prev => [msg.data, ...prev]);
          addToast('error', `New Alert: ${msg.data.title}`);
        }
      } catch (e) {
        console.error('Error parsing WS message', e);
      }
    };

    ws.onclose = () => setIsBackendConnected(false);

    return () => ws.close();
  }, [selectedConveyor, addToast]);

  const simulateDamage = useCallback(async () => {
    try {
      await api.simulateDamage();
      setIsDamageSimulated(true);
      await fetchInitialData(); // Refresh to get the critical alert immediately
      setEmergencyActionsDone({ maintenance: false, controlRoom: false });
      addToast('error', '⚠ Critical damage simulated.');
    } catch (e) {
      addToast('error', 'Failed to trigger simulation via backend.');
    }
  }, [addToast, fetchInitialData]);

  const resetSimulation = useCallback(async () => {
    try {
      await api.resetSimulation();
      setIsDamageSimulated(false);
      await fetchInitialData();
      setEmergencyActionsDone({ maintenance: false, controlRoom: false });
      addToast('success', 'Simulation reset.');
    } catch (e) {
      addToast('error', 'Failed to reset simulation via backend.');
    }
  }, [addToast, fetchInitialData]);

  const acknowledgeAlert = useCallback(async (id: string) => {
    try {
      await api.acknowledgeAlert(id);
      setAlertList((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
    } catch (e) {
      addToast('error', 'Failed to acknowledge alert.');
    }
  }, [addToast]);

  const updateSettings = useCallback(async (newSettings: Partial<SystemSettings>) => {
    try {
      await api.updateSettings(newSettings);
      setSettings((prev) => ({ ...prev, ...newSettings }));
      const newLog: SettingChangeLog = {
        id: `config-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        details: 'System configuration settings were manually updated.'
      };
      setSettingChanges((prev) => [newLog, ...prev]);
      addToast('success', 'Settings saved successfully.');
    } catch (e) {
      addToast('error', 'Failed to save settings to backend.');
    }
  }, [addToast]);

  const openEmergencyModal = useCallback(() => setIsEmergencyModalOpen(true), []);
  const closeEmergencyModal = useCallback(() => setIsEmergencyModalOpen(false), []);

  const notifyMaintenance = useCallback(() => {
    setEmergencyActionsDone((prev) => ({ ...prev, maintenance: true }));
    addToast('success', '✓ Maintenance team notified successfully.');
  }, [addToast]);

  const notifyControlRoom = useCallback(() => {
    setEmergencyActionsDone((prev) => ({ ...prev, controlRoom: true }));
    addToast('warning', '✓ Control room alert triggered.');
  }, [addToast]);

  const sendEmergencyAlert = useCallback(async () => {
    try {
      await api.triggerEmergency(selectedConveyor);
      setEmergencyActionsDone({ maintenance: true, controlRoom: true });
      closeEmergencyModal();
      addToast('error', '✓ Emergency alert sent to all teams.');
    } catch (e) {
      addToast('error', 'Failed to trigger emergency alert.');
    }
  }, [addToast, closeEmergencyModal, selectedConveyor]);

  const value: AppContextValue = {
    selectedConveyor, isDamageSimulated, isEmergencyModalOpen,
    alerts: alertList, damages: damageList, laserScans: scanList,
    currentScan, predictions: predictionList, sensors, riskScore,
    beltHealth, maxCrackDepth, estimatedRemainingDays, toasts,
    settings, emergencyActionsDone, isBackendConnected, settingChanges,
    setSelectedConveyor, simulateDamage, resetSimulation,
    openEmergencyModal, closeEmergencyModal, acknowledgeAlert,
    addToast, removeToast, updateSettings, notifyMaintenance,
    notifyControlRoom, sendEmergencyAlert,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
