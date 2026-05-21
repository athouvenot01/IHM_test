import React from 'react';

function ConsoActuelle_VU() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', gap: '15px', flex: 1, boxSizing: 'border-box' }}>
      
      {/* --- SECTION DU HAUT : Graphique + Liste --- */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '4fr 4fr', 
        gap: '10px', 
        flex: 1 
      }}>
        
        {/* --- BLOC GAUCHE : Diagramme Camembert --- */}
        <div style={{ ...styleBloc, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            height: '100%', 
            aspectRatio: '1 / 1',
            borderRadius: '50%',
            border: '2px solid #9e4728',
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
            backgroundColor: '#e5e5ea', // Couleur de secours si le camembert plante
            background: 'conic-gradient(#b19ffb 0% 25%, #fcd34d 25% 45%, #4ade80 45% 55%, #60a5fa 55% 70%, #b45309 70% 90%, #f87171 90% 100%)'
          }} />
        </div>

        {/* --- BLOC DROITE : Liste des Appareils --- */}
        <div style={{ ...styleBloc, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px', paddingLeft: '15px' }}>
          <div style={styleLigneListe}><span style={{...stylePastille, backgroundColor: '#b19ffb'}}/> <p style={styleLabel}>Microcontrolleurs</p> <p style={styleValeur}>-- %</p></div>
          <div style={styleLigneListe}><span style={{...stylePastille, backgroundColor: '#fcd34d'}}/> <p style={styleLabel}>Rice Cooker</p> <p style={styleValeur}>-- %</p></div>
          <div style={styleLigneListe}><span style={{...stylePastille, backgroundColor: '#4ade80'}}/> <p style={styleLabel}>USB-B</p> <p style={styleValeur}>-- %</p></div>
          <div style={styleLigneListe}><span style={{...stylePastille, backgroundColor: '#60a5fa'}}/> <p style={styleLabel}>USB-C</p> <p style={styleValeur}>-- %</p></div>
          <div style={styleLigneListe}><span style={{...stylePastille, backgroundColor: '#b45309'}}/> <p style={styleLabel}>Frigo</p> <p style={styleValeur}>-- %</p></div>
          <div style={styleLigneListe}><span style={{...stylePastille, backgroundColor: '#f87171'}}/> <p style={styleLabel}>LEDS</p> <p style={styleValeur}>-- %</p></div>
        </div>

      </div>

      {/* --- SECTION DU BAS : Consommation Totale --- */}
      <div style={{ 
        ...styleBloc, 
        padding: '15px 50px', 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <h2 style={{ margin: 0, fontSize: '35px' }}>Consommation Totale :</h2>
        <p style={{ margin: 0, fontSize: '38px', fontWeight: 'bold', color: '#e67224' }}>
          -- W
        </p>
      </div>

    </div>
  );
}

// --- STYLES INTERNES ---
const styleBloc = {
  backgroundColor: '#ffffff',
  padding: '20px',
  borderRadius: '20px',
  border: '1px solid #f4dfc8',
  boxSizing: 'border-box'
};

const styleLigneListe = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  gap: '15px'
};

const stylePastille = {
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  display: 'inline-block'
};

const styleLabel = {
  margin: 0,
  fontSize: '33px',
  color: '#0a0a0a',
  flex: 1,
  textAlign: 'left'
};

const styleValeur = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#e67224',
  margin: '5px 0',
  paddingLeft: '5px'  
};

export default ConsoActuelle_VU;