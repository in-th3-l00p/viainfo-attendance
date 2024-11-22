import { useState, useEffect, useRef, useCallback } from 'react';
import { collection, query, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { LogEntry } from '../types';
import { toast } from 'react-hot-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const LOGS_PER_PAGE = 20;

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const lastDocRef = useRef<any>(null);
  const observer = useRef<IntersectionObserver>();
  const loadingRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMoreLogs();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    fetchInitialLogs();
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  const fetchInitialLogs = async () => {
    setIsLoading(true);
    try {
      const logsQuery = query(
        collection(db, 'logs'),
        orderBy('timestamp', 'desc'),
        limit(LOGS_PER_PAGE)
      );
      const querySnapshot = await getDocs(logsQuery);
      const fetchedLogs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      })) as LogEntry[];
      
      setLogs(fetchedLogs);
      lastDocRef.current = querySnapshot.docs[querySnapshot.docs.length - 1];
      setHasMore(querySnapshot.docs.length === LOGS_PER_PAGE);
    } catch (error) {
      toast.error('Eroare la încărcarea jurnalului: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMoreLogs = async () => {
    if (!hasMore || isLoading) return;
    
    setIsLoading(true);
    try {
      const logsQuery = query(
        collection(db, 'logs'),
        orderBy('timestamp', 'desc'),
        startAfter(lastDocRef.current),
        limit(LOGS_PER_PAGE)
      );
      const querySnapshot = await getDocs(logsQuery);
      const fetchedLogs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      })) as LogEntry[];
      
      setLogs(prev => [...prev, ...fetchedLogs]);
      lastDocRef.current = querySnapshot.docs[querySnapshot.docs.length - 1];
      setHasMore(querySnapshot.docs.length === LOGS_PER_PAGE);
    } catch (error) {
      toast.error('Eroare la încărcarea mai multor înregistrări: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/dashboard"
            className="flex items-center text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Înapoi la panou
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Jurnal Complet</h1>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {logs.map((log) => (
              <div key={log.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString('ro-RO')}
                    </p>
                    <p className="mt-1 text-gray-900">{log.details}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      log.action === 'create'
                        ? 'bg-green-100 text-green-800'
                        : log.action === 'update'
                        ? 'bg-blue-100 text-blue-800'
                        : log.action === 'delete'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {log.action}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div
              ref={loadingRef}
              className="flex justify-center p-6 border-t border-gray-200"
            >
              {isLoading && <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />}
            </div>
          )}

          {!hasMore && logs.length > 0 && (
            <div className="text-center p-6 text-gray-500 border-t border-gray-200">
              Nu mai sunt înregistrări de afișat
            </div>
          )}

          {!isLoading && logs.length === 0 && (
            <div className="text-center p-6 text-gray-500">
              Nu există înregistrări în jurnal
            </div>
          )}
        </div>
      </div>
    </div>
  );
}