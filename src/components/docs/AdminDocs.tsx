export default function AdminDocs() {
  return (
    <div className="prose prose-indigo max-w-none">
      <h1>Administrare Platformă</h1>

      <h2>Autentificare</h2>
      <p>
        Pentru a accesa panoul de administrare:
      </p>
      <ol>
        <li>Accesați pagina de autentificare (<code>/login</code>)</li>
        <li>Introduceți adresa de email și parola</li>
        <li>Apăsați butonul "Autentificare"</li>
      </ol>

      <h2>Funcționalități Administrative</h2>
      <p>
        Ca administrator, aveți acces la următoarele funcționalități:
      </p>
      <ul>
        <li>Adăugarea și ștergerea participanților</li>
        <li>Marcarea prezenței pentru orice participant</li>
        <li>Import/Export date în format CSV</li>
        <li>Vizualizarea jurnalului complet de activități</li>
        <li>Efectuarea acțiunilor în masă asupra participanților</li>
      </ul>

      <h2>Securitate</h2>
      <p>
        Pentru a menține securitatea platformei:
      </p>
      <ul>
        <li>Nu împărtășiți credențialele de administrator</li>
        <li>Folosiți o parolă puternică</li>
        <li>Deconectați-vă după ce terminați sesiunea de administrare</li>
        <li>Verificați periodic jurnalul de activități</li>
      </ul>

      <div className="bg-red-50 p-4 rounded-lg mt-6">
        <h3 className="text-red-800 mt-0">Important</h3>
        <p className="text-red-700 mb-0">
          Toate acțiunile efectuate în panoul de administrare sunt înregistrate
          în jurnal și pot fi auditate ulterior. Folosiți cu responsabilitate
          privilegiile de administrator.
        </p>
      </div>
    </div>
  );
}