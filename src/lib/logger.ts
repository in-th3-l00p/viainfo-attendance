import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

type ActionType = 'create' | 'update' | 'delete' | 'import';

interface LogEntry {
  action: ActionType;
  timestamp: Date;
  details: string;
  userId?: string | null;
}

export const logAction = async (action: ActionType, details: string, userId?: string | null) => {
  try {
    await addDoc(collection(db, 'logs'), {
      action,
      timestamp: new Date(),
      details,
      userId
    } as LogEntry);
  } catch (error) {
    console.error('Failed to log action:', error);
  }
};