export interface LogEntry {
  id: string;
  action: 'create' | 'update' | 'delete' | 'import' | 'export';
  timestamp: Date;
  details: string;
  userId?: string | null;
}