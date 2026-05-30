import React from 'react';
import BoutonEquipement from './BoutonEquipement';

// On passe toutes les données en paramètres depuis App.js
function Conso_Expert_1({ mesures, etatLampes, basculerLampe, basculerToutesLesLampes, basculerEquipement }) {
  
  const styleTitreColonne = {
    flex: 1,
    textAlign: 'center',
    fontSize: '24px',
    color: '#9e4728', // Marron/Rouge
    fontWeight: 'bold',
    margin: 0
  };

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
        marginBottom: '-10px' // Rapproche les titres des boîtes
      }}>
        <p style={{ ...styleTitreColonne, textAlign: 'left' }}>Équipements</p>
        <p style={styleTitreColonne}>Tension</p>
        <p style={styleTitreColonne}>Courant</p>
        <p style={styleTitreColonne}>Puissance</p>
        <p style={{ width: '120px', textAlign: 'center', margin: 0, fontSize: '24px', color: '#9e4728', fontWeight: 'bold' }}>État</p>
      </div>

      {/* --- LES LIGNES --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto', flex: 1 }}>
        
        <BoutonEquipement
          nom="USB-C"
          tension={mesures.vUsbC}
          courant={mesures.aUsbC}
          puissance={mesures.pUsbC}
          etat={mesures.usbC}
          auClic={() => basculerEquipement('usbC')}
        />

        {/* Exemple avec tes LEDs. On additionne les puissances si tu les as, sinon on met -- */}
        <BoutonEquipement
          nom="LEDS"
          tension={mesures.vLeds}
          courant={mesures.aLeds}
          puissance={mesures.pLeds}
          etat={(etatLampes.kuisine === 'ON' || etatLampes.saloon === 'ON' || etatLampes.pq === 'ON' || etatLampes.livre === 'ON') ? 'ON' : 'OFF'}
          auClic={basculerToutesLesLampes}
        />

        <BoutonEquipement
          nom="Frigo"
          tension={mesures.vFrigo}
          courant={mesures.aFrigo}
          puissance={mesures.pFrigo}
          etat={mesures.frigo}
          auClic={() => basculerEquipement('frigo')}
        />

        <BoutonEquipement
          nom="Rice Cooker"
          tension={mesures.vRice}
          courant={mesures.aRice}
          puissance={mesures.pRice}
          etat={mesures.riceCooker}
          auClic={() => basculerEquipement('riceCooker')}
        />

      </div>
    </div>
  );
}

export default Conso_Expert_1;