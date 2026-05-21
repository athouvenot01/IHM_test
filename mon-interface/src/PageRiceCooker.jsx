function PageRiceCooker() {
  
  const etatRiceCooker = 1; 
  const estAllume = etatRiceCooker !== 0;

  let puissanceConso = "0 W";
  let tempsMaintien = "02 h 15";
  let tempsCuisson = "00 h 18";

  if (etatRiceCooker === 1) {
    puissanceConso = "35 W";
  } else if (etatRiceCooker === 2) {
    puissanceConso = "450 W";
  }

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
          {puissanceConso}
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

        {/* Ligne : Cuisson */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 15px',
          borderRadius: '12px',
          // Effet visuel : la ligne s'illumine si la cuisson est active
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