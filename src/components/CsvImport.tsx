import { useState } from 'react';
import { Upload } from 'lucide-react';
import Papa from 'papaparse';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { logAction } from '../lib/logger';
import { useAuth } from '../contexts/AuthContext';

interface CsvImportProps {
  onImportComplete: () => void;
}

export default function CsvImport({ onImportComplete }: CsvImportProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const attendeesRef = collection(db, 'attendees');
          const promises = results.data.map((row: any) => 
            addDoc(attendeesRef, {
              name: row.name || row.Name || '',
              email: row.email || row.Email || '',
              isPresent: false
            })
          );

          await Promise.all(promises);
          await logAction(
            'import',
            `${results.data.length} participanți importați din CSV`,
            user?.uid
          );
          toast.success(`${results.data.length} participanți importați cu succes`);
          onImportComplete();
        } catch (error) {
          toast.error('Eroare la importarea participanților');
        } finally {
          setIsUploading(false);
          if (event.target) {
            event.target.value = '';
          }
        }
      },
      error: () => {
        toast.error('Eroare la procesarea fișierului CSV');
        setIsUploading(false);
      }
    });
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isUploading}
      />
      <button
        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          isUploading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
        disabled={isUploading}
      >
        <Upload className="h-4 w-4 mr-2" />
        {isUploading ? 'Se importă...' : 'Importă CSV'}
      </button>
    </div>
  );
}