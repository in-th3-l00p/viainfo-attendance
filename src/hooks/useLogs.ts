import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { LogEntry } from '../types';

export function useLogs(limitCount: number = 5) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const logsQuery = query(
      collection(db, 'logs'),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      logsQuery,
      (snapshot) => {
        const logsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate()
        })) as LogEntry[];
        setLogs(logsList);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching logs:', error);
        toast.error('Eroare la sincronizarea jurnalului');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [limitCount]);

  return { logs, isLoading };
}