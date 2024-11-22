export default function CsvDocs() {
  return (
    <div className="prose prose-indigo max-w-none">
      <h1>Import/Export CSV</h1>

      <h2>Importul Participanților din CSV</h2>
      <p>
        Pentru a importa o listă de participanți dintr-un fișier CSV:
      </p>
      <ol>
        <li>Pregătiți un fișier CSV cu următoarele coloane:
          <ul>
            <li><code>name</code> sau <code>Name</code> - Numele participantului</li>
            <li><code>email</code> sau <code>Email</code> - Adresa de email</li>
          </ul>
        </li>
        <li>În panoul de administrare, apăsați butonul "Importă CSV"</li>
        <li>Selectați fișierul CSV pregătit</li>
        <li>Așteptați confirmarea importului</li>
      </ol>

      <h2>Exportul Datelor în CSV</h2>
      <p>
        Pentru a exporta lista curentă de participanți și statusul lor:
      </p>
      <ol>
        <li>În panoul de administrare, apăsați butonul "Exportă CSV"</li>
        <li>Fișierul va fi descărcat automat cu numele format din:
          <ul>
            <li><code>prezenta_YYYY-MM-DD.csv</code></li>
          </ul>
        </li>
      </ol>

      <h2>Structura Fișierului CSV Exportat</h2>
      <p>
        Fișierul CSV exportat va conține următoarele coloane:
      </p>
      <ul>
        <li><code>name</code> - Numele participantului</li>
        <li><code>email</code> - Adresa de email</li>
        <li><code>status</code> - Statusul prezenței (Prezent/Absent)</li>
      </ul>

      <div className="bg-green-50 p-4 rounded-lg mt-6">
        <h3 className="text-green-800 mt-0">Sfat</h3>
        <p className="text-green-700 mb-0">
          Este recomandat să exportați periodic datele pentru a avea o copie de siguranță
          a informațiilor și pentru a putea analiza prezența în timp.
        </p>
      </div>
    </div>
  );
}