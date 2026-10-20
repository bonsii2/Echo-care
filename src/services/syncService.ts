import { StorageService } from './storage';
import { SymptomLog, HEWReport } from '../types';

export interface SyncStatus {
  isOnline: boolean;
  pendingLogsCount: number;
  pendingReportsCount: number;
  lastSyncTime: string | null;
}

let mockIsOnline = true; // Default toggleable online status for prototype

export const SyncService = {
  // Toggle mock network connectivity for prototype testing
  setOnlineStatus(online: boolean): void {
    mockIsOnline = online;
  },

  isOnline(): boolean {
    return mockIsOnline;
  },

  async getSyncStatus(): Promise<SyncStatus> {
    const logs = await StorageService.getSymptomLogs();
    const reports = await StorageService.getHEWReports();

    const pendingLogs = logs.filter((l) => !l.synced);
    const pendingReports = reports.filter((r) => r.status === 'pending');

    return {
      isOnline: mockIsOnline,
      pendingLogsCount: pendingLogs.length,
      pendingReportsCount: pendingReports.length,
      lastSyncTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  },

  async syncPendingData(): Promise<{ syncedLogs: number; syncedReports: number }> {
    if (!mockIsOnline) {
      return { syncedLogs: 0, syncedReports: 0 };
    }

    const logs = await StorageService.getSymptomLogs();
    const reports = await StorageService.getHEWReports();

    let syncedLogsCount = 0;
    let syncedReportsCount = 0;

    // Sync symptoms
    const updatedLogs: SymptomLog[] = logs.map((log) => {
      if (!log.synced) {
        syncedLogsCount++;
        return { ...log, synced: true };
      }
      return log;
    });

    // Sync HEW reports
    const updatedReports: HEWReport[] = reports.map((rep) => {
      if (rep.status === 'pending') {
        syncedReportsCount++;
        return { ...rep, status: 'sent' };
      }
      return rep;
    });

    await StorageService.saveProfile(await StorageService.getProfile());
    
    return { syncedLogs: syncedLogsCount, syncedReports: syncedReportsCount };
  }
};
