import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';

interface Attendee {
  id: string;
  name: string;
  email: string;
  isPresent: boolean;
}

export function useAttendees() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'attendees'),
      (snapshot) => {
        const attendeesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Attendee));
        setAttendees(attendeesList);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching attendees:', error);
        toast.error('Eroare la sincronizarea participanților');
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe()
    };
  }, []);

  return { attendees, isLoading };
}