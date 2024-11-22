import { useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { ArrowLeft, Book, Users, FileSpreadsheet, ClipboardList, Settings } from 'lucide-react';
import GeneralDocs from '../components/docs/GeneralDocs';
import AttendanceDocs from '../components/docs/AttendanceDocs';
import CsvDocs from '../components/docs/CsvDocs';
import LogsDocs from '../components/docs/LogsDocs';
import AdminDocs from '../components/docs/AdminDocs';

const sidebarItems = [
  { path: '', icon: Book, label: 'Informații Generale' },
  { path: 'attendance', icon: Users, label: 'Gestionare Prezență' },
  { path: 'csv', icon: FileSpreadsheet, label: 'Import/Export CSV' },
  { path: 'logs', icon: ClipboardList, label: 'Jurnal Activități' },
  { path: 'admin', icon: Settings, label: 'Administrare' },
];

export default function Documentation() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className={`bg-white shadow-lg ${isSidebarOpen ? 'w-72' : 'w-20'} transition-all duration-300 flex flex-col`}>
          <div className="p-6 border-b border-gray-200">
            <Link
              to="/dashboard"
              className="flex items-center text-indigo-600 hover:text-indigo-700 mb-6"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className={isSidebarOpen ? 'block' : 'hidden'}>Înapoi la panou</span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              {isSidebarOpen ? '« Restrânge' : '»'}
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            {sidebarItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === `/docs/${path}`;
              return (
                <Link
                  key={path}
                  to={`/docs/${path}`}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isSidebarOpen ? 'mr-3' : ''}`} />
                  {isSidebarOpen && <span>{label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto bg-white">
          <div className="max-w-4xl mx-auto px-8 py-12">
            <Routes>
              <Route path="" element={<GeneralDocs />} />
              <Route path="attendance" element={<AttendanceDocs />} />
              <Route path="csv" element={<CsvDocs />} />
              <Route path="logs" element={<LogsDocs />} />
              <Route path="admin" element={<AdminDocs />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}