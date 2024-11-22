export default function GeneralDocs() {
  return (
    <div className="prose prose-indigo max-w-none">
      <h1>Documentație Platformă ViaInfo</h1>
      <p>
        Bine ați venit în documentația platformei de gestionare a prezenței pentru Clubul ViaInfo.
        Această platformă a fost creată pentru a facilita procesul de monitorizare a prezenței
        membrilor la întâlnirile clubului.
      </p>

      <h2>Caracteristici Principale</h2>
      <ul>
        <li>Gestionarea listei de participanți</li>
        <li>Marcarea prezenței pentru fiecare participant</li>
        <li>Import/Export date în format CSV</li>
        <li>Sistem de jurnalizare a activităților</li>
        <li>Panou de administrare securizat</li>
      </ul>

      <h2>Structura Platformei</h2>
      <p>
        Platforma este împărțită în două secțiuni principale:
      </p>
      <ul>
        <li>
          <strong>Pagina Principală</strong> - Accesibilă tuturor participanților pentru
          marcarea prezenței
        </li>
        <li>
          <strong>Panoul de Administrare</strong> - Zonă protejată pentru administratori,
          cu funcționalități complete de gestionare
        </li>
      </ul>

      <div className="bg-blue-50 p-4 rounded-lg mt-6">
        <h3 className="text-blue-800 mt-0">Notă Importantă</h3>
        <p className="text-blue-700 mb-0">
          Pentru a accesa funcționalitățile complete ale platformei, este necesară
          autentificarea în panoul de administrare. Consultați secțiunea "Administrare"
          pentru mai multe detalii despre gestionarea conturilor și permisiunilor.
        </p>
      </div>
    </div>
  );
}