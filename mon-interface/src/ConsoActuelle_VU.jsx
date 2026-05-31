import React from 'react';

function ConsoActuelle_VU({pMicro, pRice, pUsbB, pUsbC, pFrigo, pLeds, pTotal, pMax}) {

  const pMicroVal = Number(pMicro) || 0;
  const pRiceVal = Number(pRice) || 0;
  const pUsbBVal = Number(pUsbB) || 0;
  const pUsbCVal = Number(pUsbC) || 0;
  const pFrigoVal = Number(pFrigo) || 0;
  const pLedsVal = Number(pLeds) || 0;

  const prop_micro = (pMicroVal / pMax) * 100;
  const prop_rice = (pRiceVal / pMax) * 100;
  const prop_usb_b = (pUsbBVal / pMax) * 100;
  const prop_usb_c = (pUsbCVal / pMax) * 100;
  const prop_frigo = (pFrigoVal / pMax) * 100;
  const prop_leds = (pLedsVal / pMax) * 100;
  const prop_dispo = 100 - (prop_micro + prop_rice + prop_usb_b + prop_usb_c + prop_frigo + prop_leds);

  const s1 = prop_micro;
  const s2 = s1 + prop_rice;
  const s3 = s2 + prop_usb_b;
  const s4 = s3 + prop_usb_c;
  const s5 = s4 + prop_frigo;
  const s6 = s5 + prop_leds;

  const gradientCamembert = `conic-gradient(
    #b19ffb 0% ${s1}%, 
    #fcd34d ${s1}% ${s2}%, 
    #4ade80 ${s2}% ${s3}%, 
    #60a5fa ${s3}% ${s4}%, 
    #b45309 ${s4}% ${s5}%, 
    #f87171 ${s5}% ${s6}%,
    #e5e5ea00 ${s6}% 100% 
  )`;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', gap: '15px', flex: 1, boxSizing: 'border-box' }}>
      
      {/* --- SECTION DU HAUT : Graphique + Liste --- */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '4fr 4fr', 
        gap: '10px', 
        flex: 1 ,
        minHeight: 0
      }}>
        
        {/* --- BLOC GAUCHE : Diagramme Camembert --- */}
        <div style={{ ...styleBloc, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            height: '90%', 
            maxWidth: '350px',
            maxHeight: '100%',
            aspectRatio: '1 / 1',
            borderRadius: '50%',
            border: '2px solid #9e4728',
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
            backgroundColor: '#e5e5ea', // Couleur de secours si le camembert plante
            background: gradientCamembert
          }} />
        </div>

        {/* --- BLOC DROITE : Liste des Appareils --- */}
        <div style={{ ...styleBloc, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px', paddingLeft: '15px' }}>
          <div style={styleLigneListe}><span style={{...stylePastille, backgroundColor: '#b19ffb'}}/> <p style={styleLabel}>Microcontrolleurs</p> <p style={styleValeur}>{prop_micro.toFixed(1)} %</p></div>
          <div style={styleLigneListe}><span style={{...stylePastille, backgroundColor: '#fcd34d'}}/> <p style={styleLabel}>Rice Cooker</p> <p style={styleValeur}>{prop_rice.toFixed(1)} %</p></div>
          <div style={styleLigneListe}><span style={{...stylePastille, backgroundColor: '#4ade80'}}/> <p style={styleLabel}>USB-B</p> <p style={styleValeur}>{prop_usb_b.toFixed(1)} %</p></div>
          <div style={styleLigneListe}><span style={{...stylePastille, backgroundColor: '#60a5fa'}}/> <p style={styleLabel}>USB-C</p> <p style={styleValeur}>{prop_usb_c.toFixed(1)} %</p></div>
          <div style={styleLigneListe}><span style={{...stylePastille, backgroundColor: '#b45309'}}/> <p style={styleLabel}>Frigo</p> <p style={styleValeur}>{prop_frigo.toFixed(1)} %</p></div>
          <div style={styleLigneListe}><span style={{...stylePastille, backgroundColor: '#f87171'}}/> <p style={styleLabel}>LEDS</p> <p style={styleValeur}>{prop_leds.toFixed(1)} %</p></div>
          <div style={styleLigneListe}><span style={{...stylePastille, backgroundColor: '#ffffff', border: '1px solid #b45309'}}/> <p style={styleLabel}>Disponible</p> <p style={styleValeur}>{prop_dispo.toFixed(1)} %</p></div>
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
          {Number(pTotal).toFixed(1) || 0} W
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