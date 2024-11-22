export default function LogsDocs() {
  return (
    <div className="prose prose-indigo max-w-none">
      <h1>Jurnal Activități</h1>

      <h2>Vizualizarea Jurnalului</h2>
      <p>
        Sistemul păstrează un jurnal detaliat al tuturor acțiunilor efectuate în platformă.
        Acesta poate fi accesat în două moduri:
      </p>
      <ul>
        <li>
          <strong>Jurnal Recent</strong> - Afișat în panoul de administrare, prezintă
          ultimele 5 activități
        </li>
        <li>
          <strong>Jurnal Complet</strong> - Accesibil prin butonul "Vezi toate jurnalele",
          prezintă întregul istoric al activităților
        </li>
      </ul>

      <h2>Tipuri de Activități Înregistrate</h2>
      <p>
        Sistemul înregistrează următoarele tipuri de activități:
      </p>
      <ul>
        <li>
          <strong>create</strong> - Adăugarea unui nou participant
        </li>
        <li>
          <strong>update</strong> - Modificarea statusului de prezență
        </li>
        <li>
          <strong>delete</strong> - Ștergerea unui participant
        </li>
        <li>
          <strong>import</strong> - Importul participanților din CSV
        </li>
        <li>
          <strong>export</strong> - Exportul datelor în format CSV
        </li>
      </ul>

      <h2>Informații Înregistrate</h2>
      <p>
        Pentru fiecare activitate, sistemul înregistrează:
      </p>
      <ul>
        <li>Data și ora exactă a acțiunii</li>
        <li>Tipul acțiunii efectuate</li>
        <li>Detalii despre acțiune</li>
        <li>Utilizatorul care a efectuat acțiunea (pentru acțiunile din panoul admin)</li>
      </ul>

      <div className="bg-purple-50 p-4 rounded-lg mt-6">
        <h3 className="text-purple-800 mt-0">Notă</h3>
        <p className="text-purple-700 mb-0">
          Jurnalul complet folosește paginare infinită, încărcând automat mai multe
          înregistrări pe măsură ce derulați în jos.
        </p>
      </div>
    </div>
  );
}