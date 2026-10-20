import React, { createContext, useContext, useState, useEffect } from 'react';
import { SyncService, SyncStatus } from '../services/syncService';

interface SyncContextType {
  status: SyncStatus;
  toggleNetworkStatus: () => void;
  triggerManualSync: () => Promise<void>;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<SyncStatus>({
    isOnline: true,
    pendingLogsCount: 0,
    pendingReportsCount: 0,
    lastSyncTime: null,
  });

  const refreshSyncStatus = async () => {
    const s = await SyncService.getSyncStatus();
    setStatus(s);
  };

  useEffect(() => {
    refreshSyncStatus();
  }, []);

  const toggleNetworkStatus = () => {
    const current = SyncService.isOnline();
    SyncService.setOnlineStatus(!current);
    refreshSyncStatus();
  };

  const triggerManualSync = async () => {
    await SyncService.syncPendingData();
    await refreshSyncStatus();
  };

  return (
    <SyncContext.Provider value={{ status, toggleNetworkStatus, triggerManualSync }}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
};
