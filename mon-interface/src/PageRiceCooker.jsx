import { useState, useEffect } from 'react';

function PageRiceCooker({ etatRiceCooker, puissanceConso, tpsCuissonMin, tpsMaintienMin, maintienActif, maintienFinTs }) {

  const estAllume = etatRiceCooker !== 0;

  const consoValue = Number(puissanceConso) || 0;

  // Formatage des minutes en hh h mm
  const formatTemps = (minutesT) => {
    if (minutesT == null || isNaN(minutesT)) return "0 h 00";
    const h = Math.floor(minutesT / 60).toString().padStart(2, '0');
    const m = (minutesT % 60).toString().padStart(2, '0');
    return `${h} h ${m}`;
  };

  // --- DÉCOMPTE DU MAINTIEN AU CHAUD ---
  // Le back-end (Node-RED) envoie un timestamp de fin (maintienFinTs).
  // On recalcule le restant chaque seconde pour rester synchronisé avec le back-end.
  const [restantSec, setRestantSec] = useState(0);

  useEffect(() => {
    if (!maintienActif || !maintienFinTs) {
      setRestantSec(0);
      return;
    }

    const calculer = () => {
      const restant = Math.max(0, Math.round((maintienFinTs - Date.now()) / 1000));
      setRestantSec(restant);
    };

    calculer();
    const chrono = setInterval(calculer, 1000);
    return () => clearInterval(chrono);
  }, [maintienActif, maintienFinTs]);

  const formatMinSec = (totalSec) => {
    const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const s = (totalSec % 60).toString().padStart(2, '0');
    return `${m} min ${s}`;
  };

  // En mode maintien actif on affiche le décompte vivant, sinon la valeur statique.
  const tempsMaintien = (maintienActif && maintienFinTs)
    ? formatMinSec(restantSec)
    : formatTemps(tpsMaintienMin);
  const tempsCuisson = formatTemps(tpsCuissonMin);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', gap: '15px', flex: 1, boxSizing: 'border-box' }}>
      
      {/* --- SECTION DU HAUT : Consommation --- */}
      <div style={{ 
        ...styleBloc, 
        padding: '15px 50px', 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <h2 style={{ margin: 0, fontSize: '35px' }}>Consommation actuelle :</h2>
        <p style={{ margin: 0, fontSize: '38px', fontWeight: 'bold', color: estAllume ? '#e67224' : '#9e4728' }}>
          {consoValue.toFixed(1)} W
        </p>
      </div>

      {/* --- SECTION DU MILIEU : Temps d'utilisation disponible (Ton Tableau) --- */}
      <div style={{ 
        ...styleBloc, 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-around', 
        padding: '10px 15px',
        width: '90%',
        alignSelf: 'center',
      }}>
        
        {/* En-tête du tableau */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f4dfc8', paddingBottom: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '35px', color: '#636363', fontWeight: 'bold' }}>État</h3>
          <h3 style={{ margin: 0, fontSize: '35px', color: '#636363', fontWeight: 'bold' }}>Temps d'utilisation disponible</h3>
        </div>

        {/* Ligne : Cuisson */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 15px',
          borderRadius: '12px',
          backgroundColor: etatRiceCooker === 2 ? '#fff9f3' : 'transparent',
          border: etatRiceCooker === 2 ? '1px solid #f4dfc8' : '1px solid transparent'
        }}>
          <p style={{ margin: 0, fontSize: '33px', fontWeight: 'bold', color: etatRiceCooker === 2 ? '#e67224' : '#0d0d0d' }}>
            Cuisson
          </p>
          <p style={{ margin: 0, fontSize: '40px', fontWeight: 'bold', color: etatRiceCooker === 2 ? '#e67224' : '#9e4728' }}>
            {tempsCuisson}
          </p>
        </div>

        {/* Ligne : Maintien au chaud */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 15px',
          borderRadius: '12px',
          // Effet visuel : la ligne s'illumine en orange discret si le mode est actif
          backgroundColor: etatRiceCooker === 1 ? '#fff9f3' : 'transparent',
          border: etatRiceCooker === 1 ? '1px solid #f4dfc8' : '1px solid transparent'
        }}>
          <p style={{ margin: 0, fontSize: '33px', fontWeight:' bold', color: etatRiceCooker === 1 ? '#e67224' : '#0d0d0d' }}>
            Maintien au chaud
          </p>
          <p style={{ margin: 0, fontSize: '40px', fontWeight: 'bold', color: etatRiceCooker === 1 ? '#e67224' : '#9e4728' }}>
            {tempsMaintien}
          </p>
        </div>

      </div>

      {/* --- SECTION DU BAS : État du Rice Cooker --- */}
      <div style={{ 
        ...styleBloc, 
        padding: '15px 50px', 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <h2 style={{ margin: 0, fontSize: '35px' }}>État :</h2>
        <p style={{ margin: 0, fontSize: '38px', fontWeight: 'bold', color: estAllume ? '#e67224' : '#9e4728' }}>
          {estAllume ? 'Allumé' : 'Éteint'}
        </p>
      </div>

    </div>
  );
}

// --- STYLES INTERNES COHÉRENTS ---
const styleBloc = {
  backgroundColor: '#ffffff',
  padding: '20px',
  borderRadius: '20px',
  border: '1px solid #f4dfc8',
  boxSizing: 'border-box'
};

export default PageRiceCooker;


// 9c4120 : marron foncé 