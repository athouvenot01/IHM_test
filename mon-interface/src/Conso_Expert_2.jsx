import React from 'react';

function Conso_Expert_2({ mesures }) {
  
  // --- STYLES ---
  const styleTitreColonne = {
    flex: 1,
    textAlign: 'center',
    fontSize: '24px',
    color: '#9e4728', 
    fontWeight: 'bold',
    margin: 0
  };

  const styleCellule = {
    flex: 1, 
    textAlign: 'center',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#e67224' 
  };

  const styleLabel = {
    ...styleCellule,
    textAlign: 'left',
    color: '#1a1a1a', 
    fontSize: '32px'
  };

  const styleLigne = {
    flex: 1, 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    border: '1px solid #f4dfc8',
    borderRadius: '15px',
    padding: '15px 25px'
  };

  // --- SOUS-COMPOSANT INTERNE ---
  const LigneInfo = ({ nom, tension, courant, puissance }) => (
    <div style={styleLigne}>
      <div style={styleLabel}>{nom}</div>
      <div style={styleCellule}>{tension > 0 ? `${tension.toFixed(1)} V` : '-- V'}</div>
      <div style={styleCellule}>{courant > 0 ? `${courant.toFixed(2)} A` : '-- A'}</div>
      <div style={styleCellule}>{puissance > 0 ? `${puissance.toFixed(0)} W` : '-- W'}</div>
    </div>
  );

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      width: '100%', 
      gap: '20px', 
      padding: '20px',
      boxSizing: 'border-box',
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      border: '1px solid #f4dfc8'
    }}>

      {/* --- EN-TÊTE DU TABLEAU --- */}
      <div style={{ 
        display: 'flex', 
        padding: '0 25px', 
        marginBottom: '-10px' 
      }}>
        <p style={{ ...styleTitreColonne, textAlign: 'left' }}>Équipements</p>
        <p style={styleTitreColonne}>Tension</p>
        <p style={styleTitreColonne}>Courant</p>
        <p style={styleTitreColonne}>Puissance</p>
      </div>

      {/* --- LES LIGNES --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto', flex: 1 }}>
        
        <LigneInfo
          nom="Éolienne"
          tension={mesures.vAlternateur || 0}
          courant={mesures.aAlternateur || 0}
          puissance={mesures.pAlternateur || 0}
        />

        <LigneInfo
          nom="Batterie"
          tension={mesures.vBatterie || 0} 
          courant={mesures.aBatterie || 0}
          puissance={mesures.pBatterie || 0}
        />

        <LigneInfo
          nom="Micro-controlleurs"
          tension={mesures.vMicro || 0} 
          courant={mesures.aMicro || 0}
          puissance={mesures.pMicro || 0} 
        />

        <LigneInfo
          nom="USB-B"
          tension={mesures.vUsbB || 0}
          courant={mesures.aUsbB || 0}
          puissance={mesures.pUsbB || 0}
        />

      </div>
    </div>
  );
}

export default Conso_Expert_2;