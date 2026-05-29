import React from 'react';
import BoutonEquipement from './BoutonEquipement';

// On passe toutes les données en paramètres depuis App.js
function Conso_Expert_1({ mesures, etatLampes, basculerLampe, basculerEquipement }) {
  
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto' }}>
        
        <BoutonEquipement
          nom="USB-C" 
          tension={mesures.v_usb_c} 
          courant={mesures.a_usb_c} 
          puissance={mesures.p_usb_c} 
          etat={mesures.usb_c} 
          auClic={() => basculerEquipement('usb_c')} 
        />

        {/* Exemple avec tes LEDs. On additionne les puissances si tu les as, sinon on met -- */}
        <BoutonEquipement
          nom="LEDS" 
          tension={mesures.v_leds} 
          courant={mesures.a_leds} 
          puissance={mesures.p_leds} 
          // Si au moins une lampe est allumée, on considère l'ensemble "ON"
          etat={(etatLampes.kuisine === 'ON' || etatLampes.saloon === 'ON' || etatLampes.pq === 'ON' || etatLampes.livre === 'ON') ? 'ON' : 'OFF'} 
          auClic={() => basculerLampe('kuisine')}
        />

        <BoutonEquipement
          nom="Frigo" 
          tension={mesures.v_frigo} 
          courant={mesures.a_frigo} 
          puissance={mesures.p_frigo} 
          etat={mesures.frigo} 
          auClic={() => basculerEquipement('frigo')} 
        />

        <BoutonEquipement
          nom="Rice Cooker" 
          tension={mesures.v_rice} 
          courant={mesures.a_rice} 
          puissance={mesures.p_rice} 
          etat={mesures.rice} 
          auClic={() => basculerEquipement('rice')} 
        />

      </div>
    </div>
  );
}

export default Conso_Expert_1;