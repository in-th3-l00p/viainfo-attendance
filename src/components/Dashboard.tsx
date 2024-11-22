import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { LogOut, Plus, Trash, Check, X, CheckSquare, Square, Loader2, Book, ClipboardList, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import CsvImport from './CsvImport';
import { logAction } from '../lib/logger';
import { exportToCsv } from '../utils/csvExport';
import { useAttendees } from '../hooks/useAttendees';
import { useLogs } from '../hooks/useLogs';

interface LoadingStates {
  [key: string]: boolean;
}

export default function Dashboard() {
  const { logout, user } = useAuth();
  const { attendees, isLoading: isLoadingAttendees } = useAttendees();
  const { logs: recentLogs } = useLogs(5);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({});
  const [isAddingAttendee, setIsAddingAttendee] = useState(false);
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleAddAttendee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingAttendee(true);
    try {
      const docRef = await addDoc(collection(db, 'attendees'), {
        name: newName,
        email: newEmail,
        isPresent: false
      });
      
      await logAction(
        'create',
        `Participant adăugat: ${newName} (${docRef.id})`,
        user?.uid
      );
      
      setNewName('');
      setNewEmail('');
      toast.success('Participant adăugat cu succes!');
    } catch (error) {
      toast.error('Eroare la adăugarea participantului');
    } finally {
      setIsAddingAttendee(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    setLoadingStates(prev => ({ ...prev, [id]: true }));
    try {
      await deleteDoc(doc(db, 'attendees', id));
      await logAction(
        'delete',
        `Participant șters: ${name} (${id})`,
        user?.uid
      );
      toast.success('Participant șters cu succes!');
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (error) {
      toast.error('Eroare la ștergerea participantului');
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  const togglePresence = async (id: string, name: string, currentStatus: boolean) => {
    setLoadingStates(prev => ({ ...prev, [`presence-${id}`]: true }));
    try {
      await updateDoc(doc(db, 'attendees', id), {
        isPresent: !currentStatus
      });
      await logAction(
        'update',
        `Prezență actualizată pentru ${name} (${id}): ${currentStatus ? 'absent' : 'prezent'}`,
        user?.uid
      );
    } catch (error) {
      toast.error('Eroare la actualizarea prezenței');
    } finally {
      setLoadingStates(prev => ({ ...prev, [`presence-${id}`]: false }));
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Deconectare reușită!');
    } catch (error) {
      toast.error('Eroare la deconectare');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === attendees.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(attendees.map(a => a.id)));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    setIsBulkActionLoading(true);
    try {
      const promises = Array.from(selectedIds).map(id => {
        const attendee = attendees.find(a => a.id === id);
        if (!attendee) return Promise.resolve();
        
        return Promise.all([
          deleteDoc(doc(db, 'attendees', id)),
          logAction('delete', `Participanți șterși în masă: ${attendee.name} (${id})`, user?.uid)
        ]);
      });

      await Promise.all(promises);
      toast.success(`${selectedIds.size} participanți au fost șterși cu succes`);
      setSelectedIds(new Set());
    } catch (error) {
      toast.error('Eroare la ștergerea participanților selectați');
    } finally {
      setIsBulkActionLoading(false);
    }
  };

  const handleBulkPresence = async (present: boolean) => {
    if (selectedIds.size === 0) return;

    setIsBulkActionLoading(true);
    try {
      const promises = Array.from(selectedIds).map(id => {
        const attendee = attendees.find(a => a.id === id);
        if (!attendee) return Promise.resolve();

        return Promise.all([
          updateDoc(doc(db, 'attendees', id), { isPresent: present }),
          logAction(
            'update',
            `Prezență actualizată în masă pentru ${attendee.name} (${id}): ${present ? 'prezent' : 'absent'}`,
            user?.uid
          )
        ]);
      });

      await Promise.all(promises);
      toast.success(`${selectedIds.size} participanți marcați ca ${present ? 'prezenți' : 'absenți'}`);
    } catch (error) {
      toast.error('Eroare la actualizarea prezenței');
    } finally {
      setIsBulkActionLoading(false);
    }
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const data = attendees.map(({ name, email, isPresent }) => ({
        name,
        email,
        status: isPresent ? 'Prezent' : 'Absent'
      }));

      const filename = `prezenta_${new Date().toISOString().split('T')[0]}.csv`;
      exportToCsv(data, filename);
      
      await logAction(
        'export',
        `Export CSV: ${attendees.length} participanți`,
        user?.uid
      );
      
      toast.success('Date exportate cu succes!');
    } catch (error) {
      toast.error('Eroare la exportul datelor');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoadingAttendees) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Se încarcă participanții...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panou de Administrare</h1>
          <div className="flex gap-2">
            <Link
              to="/docs"
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Book className="h-4 w-4 mr-2" />
              Documentație
            </Link>
            <Link
              to="/logs"
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <ClipboardList className="h-4 w-4 mr-2" />
              Vezi toate jurnalele
            </Link>
            <button
              onClick={handleExportCsv}
              disabled={isExporting || attendees.length === 0}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {isExporting ? 'Se exportă...' : 'Exportă CSV'}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Deconectare
            </button>
          </div>
        </div>

        {/* Recent Logs Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Activități Recente</h2>
          <div className="space-y-4">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {new Date(log.timestamp).toLocaleString('ro-RO')}
                </span>
                <span className="flex-1 mx-4">{log.details}</span>
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
            ))}
            {recentLogs.length === 0 && (
              <p className="text-gray-500 text-center">Nu există activități recente</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Adaugă Participant Nou</h2>
            <CsvImport onImportComplete={() => {}} />
          </div>
          <form onSubmit={handleAddAttendee} className="flex gap-4">
            <input
              type="text"
              placeholder="Nume"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
              disabled={isAddingAttendee}
            />
            <input
              type="email"
              placeholder="Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
              disabled={isAddingAttendee}
            />
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
              disabled={isAddingAttendee}
            >
              {isAddingAttendee ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              {isAddingAttendee ? 'Se adaugă...' : 'Adaugă Participant'}
            </button>
          </form>
        </div>

        {selectedIds.size > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedIds.size} {selectedIds.size === 1 ? 'participant selectat' : 'participanți selectați'}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkPresence(true)}
                className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200 disabled:opacity-50"
                disabled={isBulkActionLoading}
              >
                {isBulkActionLoading ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 mr-1" />
                )}
                Marchează Prezent
              </button>
              <button
                onClick={() => handleBulkPresence(false)}
                className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 disabled:opacity-50"
                disabled={isBulkActionLoading}
              >
                {isBulkActionLoading ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <X className="h-4 w-4 mr-1" />
                )}
                Marchează Absent
              </button>
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                disabled={isBulkActionLoading}
              >
                {isBulkActionLoading ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Trash className="h-4 w-4 mr-1" />
                )}
                Șterge Selectați
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                  <button
                    onClick={toggleSelectAll}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {selectedIds.size === attendees.length ? (
                      <CheckSquare className="h-5 w-5" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nume
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prezență
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acțiuni
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendees.map((attendee) => (
                <tr key={attendee.id} className={selectedIds.has(attendee.id) ? 'bg-indigo-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleSelect(attendee.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {selectedIds.has(attendee.id) ? (
                        <CheckSquare className="h-5 w-5" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {attendee.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {attendee.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => togglePresence(attendee.id, attendee.name, attendee.isPresent)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        attendee.isPresent
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      } disabled:opacity-50`}
                      disabled={loadingStates[`presence-${attendee.id}`]}
                    >
                      {loadingStates[`presence-${attendee.id}`] ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : attendee.isPresent ? (
                        <Check className="h-4 w-4 mr-1" />
                      ) : (
                        <X className="h-4 w-4 mr-1" />
                      )}
                      {attendee.isPresent ? 'Prezent' : 'Absent'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleDelete(attendee.id, attendee.name)}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      disabled={loadingStates[attendee.id]}
                    >
                      {loadingStates[attendee.id] ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Trash className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}