export default function AttendanceDocs() {
  return (
    <div className="prose prose-indigo max-w-none">
      <h1>Gestionarea Prezenței</h1>
      
      <h2>Marcarea Prezenței</h2>
      <p>
        Există două modalități de a marca prezența participanților:
      </p>
      <ul>
        <li>
          <strong>Individual</strong> - Prin butonul de prezență din dreptul fiecărui participant
        </li>
        <li>
          <strong>În masă</strong> - Selectând mai mulți participanți și utilizând acțiunile în masă
        </li>
      </ul>

      <h2>Adăugarea Participanților</h2>
      <p>
        Pentru a adăuga participanți noi în sistem:
      </p>
      <ol>
        <li>Accesați formularul "Adaugă Participant Nou"</li>
        <li>Completați numele și adresa de email</li>
        <li>Apăsați butonul "Adaugă Participant"</li>
      </ol>

      <h2>Acțiuni în Masă</h2>
      <p>
        Pentru a efectua acțiuni asupra mai multor participanți simultan:
      </p>
      <ol>
        <li>Selectați participanții folosind căsuțele de selectare</li>
        <li>Utilizați butoanele de acțiune în masă:
          <ul>
            <li>"Marchează Prezent" - Marchează toți participanții selectați ca prezenți</li>
            <li>"Marchează Absent" - Marchează toți participanții selectați ca absenți</li>
            <li>"Șterge Selectați" - Șterge participanții selectați din sistem</li>
          </ul>
        </li>
      </ol>

      <div className="bg-yellow-50 p-4 rounded-lg mt-6">
        <h3 className="text-yellow-800 mt-0">Atenție</h3>
        <p className="text-yellow-700 mb-0">
          Ștergerea participanților este o acțiune permanentă și nu poate fi anulată.
          Asigurați-vă că doriți să ștergeți participanții selectați înainte de a confirma acțiunea.
        </p>
      </div>
    </div>
  );
}