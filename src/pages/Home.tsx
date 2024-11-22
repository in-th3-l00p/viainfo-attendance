import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { Users, Check, X, Loader2 } from 'lucide-react';
import { logAction } from '../lib/logger';
import { ViaInfoLogo } from '../components/ViaInfoLogo';

interface Attendee {
  id: string;
  name: string;
  email: string;
  isPresent: boolean;
}

interface LoadingStates {
  [key: string]: boolean;
}

export default function Home() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({});

  useEffect(() => {
    fetchAttendees();
  }, []);

  const fetchAttendees = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'attendees'));
      const attendeesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Attendee));
      setAttendees(attendeesList);
    } catch (error) {
      toast.error('Eroare la încărcarea participanților');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePresence = async (id: string, name: string, currentStatus: boolean) => {
    setLoadingStates(prev => ({ ...prev, [id]: true }));
    try {
      await updateDoc(doc(db, 'attendees', id), {
        isPresent: !currentStatus
      });
      await logAction(
        'update',
        `Prezență marcată pentru ${name} (${id}): ${currentStatus ? 'absent' : 'prezent'}`,
        null
      );
      fetchAttendees();
    } catch (error) {
      toast.error('Eroare la actualizarea prezenței');
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  if (isLoading) {
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
        <div className="text-center mb-8">
          <ViaInfoLogo className="mx-auto h-24 w-24" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Prezență Club ViaInfo
          </h1>
          <p className="mt-2 text-gray-600">
            Marchează-ți prezența pentru întâlnirea de astăzi
          </p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nume
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prezență
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendees.map((attendee) => (
                <tr key={attendee.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {attendee.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {attendee.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => togglePresence(attendee.id, attendee.name, attendee.isPresent)}
                      className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        attendee.isPresent
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      } disabled:opacity-50`}
                      disabled={loadingStates[attendee.id]}
                    >
                      {loadingStates[attendee.id] ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : attendee.isPresent ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <X className="h-4 w-4 mr-2" />
                      )}
                      {attendee.isPresent ? 'Prezent' : 'Marchează Prezent'}
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