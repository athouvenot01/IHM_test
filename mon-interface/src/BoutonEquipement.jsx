import React from 'react';

function BoutonEquipement({ nom, tension, courant, puissance, etat, auClic, peutAllumer = true }) {
  const allume = etat === 'ON' || etat === 1 || etat === 2;

  const gererClic = () => {
    if (!peutAllumer && !allume) {
      return; // Empêcher l'allumage si peutAllumer est false
    }
    auClic();
  };

  // --- STYLES INTERNES ---
  const styleCellule = {
    flex: 1, 
    textAlign: 'center',
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#e67224',
    fontFamily: 'Montserrat, sans-serif'
  };

  const styleLabel = {
    ...styleCellule,
    textAlign: 'left',
    color: '#1a1a1a', 
    fontSize: '30px',
    fontFamily: 'Montserrat, sans-serif'
  };

  const styleBoiteOnOff = {
    width: '60px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    borderRadius: '8px',
    transition: 'all 0.2s ease'
  };

  return (
    <div
      onClick={gererClic}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: allume ? '#fefdf9' : 'white',
        border: '1px solid #f4dfc8',
        borderRadius: '15px',
        padding: '5px 10px',
        cursor: peutAllumer || allume ? 'pointer' : 'not-allowed',
        boxShadow: allume ? '0px 2px 15px -5px rgba(230, 114, 36, 0.2)' : 'none',
        transition: 'all 0.2s ease',
        opacity: peutAllumer || allume ? 1 : 0.7
      }}
      onMouseDown={(e) => {
        if (peutAllumer || allume) e.currentTarget.style.transform = 'scale(0.98)';
      }}
      onMouseUp={(e) => {
        if (peutAllumer || allume) e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      
      {/* 1. Nom de l'équipement */}
      <div style={styleLabel}>{nom}</div>

      {/* 2. Tension */}
      <div style={styleCellule}>{tension > 0 ? `${tension.toFixed(1)} V` : '0 V'}</div>

      {/* 3. Courant */}
      <div style={styleCellule}>{courant > 0 ? `${courant.toFixed(2)} A` : '0 A'}</div>

      {/* 4. Puissance */}
      <div style={styleCellule}>{puissance > 0 ? `${puissance.toFixed(0)} W` : '0 W'}</div>

      {/* 5. Le faux interrupteur ON/OFF */}
      <div style={{ 
        display: 'flex', 
        border: '2px solid #e5e5ea', 
        borderRadius: '10px', 
        overflow: 'hidden', // Pour que les petits carrés ne dépassent pas des bords arrondis
        width: '120px'
      }}>
        {/* Carré ON */}
        <div style={{
          ...styleBoiteOnOff,
          backgroundColor: allume ? '#f9d6a1' : !peutAllumer ? '#d3d3d3' : 'transparent',
          color: allume ? '#9e4728' : !peutAllumer ? '#999999' : '#a3a3a3',
          opacity: !peutAllumer && !allume ? 0.5 : 1
        }}>
          ON
        </div>
        
        {/* Carré OFF */}
        <div style={{ 
          ...styleBoiteOnOff, 
          backgroundColor: !allume ? '#e5e5ea' : 'transparent', // Gris si éteint, transparent sinon
          color: !allume ? '#767573' : '#a3a3a3' 
        }}>
          OFF
        </div>
      </div>

    </div>
  );
}

export default BoutonEquipement;