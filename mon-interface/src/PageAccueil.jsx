import React from 'react';
import eolienne from './dessin/0-eolienne.svg';

function PageAccueil({ vitesseVent, heure, p_total, p_micro, p_prod }) {
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', gap: '10px', flex: 1, boxSizing: 'border-box' }}>
      
      {/* --- GRILLE PRINCIPALE (2 Colonnes) --- */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '5fr 3fr',                   // La colonne de gauche est 2x plus large
        gap: '10px', 
        flex: 1,
      }}>
        
        {/* --- COLONNE GAUCHE (Maison + Batterie) --- */}
        <div style={{ display: 'grid', gridTemplateRows: '6fr 5fr', gap: '10px' }}>
          
          {/* Bloc Maison */}
          <div style={styleBloc}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h2 style={{ margin: 0 }}>Maison :</h2>
              
              <p style={{ fontSize: '37px', fontWeight: 'bold', color: '#9e4728', margin: 0 }}>
                {heure}
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 'calc(100% - 40px)', paddingTop: '10px', boxSizing: 'border-box' }}>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <p>Consommation générale : </p>
                <p style={{...styleValeur, marginLeft: '20px', marginBottom: '15px' }}>-- W</p>
                <p>Consommation continue : </p>
                <p style={{...styleValeur, marginLeft: '20px' }}>-- W</p>
              </div>
            </div>
          </div>

          {/* Bloc Batterie */}
          <div style={{...styleBloc, display: 'flex', flexDirection: 'column', height: '100%'}}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ margin: 0 }}>Batterie :</h2>
              
              {/* Conteneur pour l'heure. On utilise established orange style pour emphasis. */}
              <p style={{ marginLeft: '10px', fontSize: '35px', fontWeight: 'bold', color: '#e67224' }}>
                75 %
              </p>
            </div>
            {/* Barre de progression */}
            <div style={{ width: '100%', height: '30px', backgroundColor: '#eee', borderRadius: '15px', marginTop: '5px', overflow: 'hidden', border: '1px solid #ddd' }}>
              <div style={{ width: '75%', height: '100%', backgroundColor: '#e67224', transition: 'width 0.5s ease' }} />
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              width: '100%',
              paddingTop: '15px',
              flex: 1,
              minHeight: 0, 
            }}>
              {/* Colonne Gauche : Statut */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', height: '100%' }}>
                <p>Statut :</p>
                <p style={{fontWeight: 'bold', color: '#e67224', fontSize: '30px', alignSelf: 'center', marginTop: '5px' }}>
                  Charge
                </p>
              </div>

              {/* Colonne Droite : Autonomie */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', height: '100%'}}>
                <p>Autonomie :</p>
                <p style={{ fontWeight: 'bold', color: '#e67224', fontSize: '30px', alignSelf: 'center', marginTop: '5px' }}>
                  1h 10min
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- COLONNE DROITE (eolienne) --- */}
        <div style={{ ...styleBloc, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <h2>Éolienne :</h2>
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            marginTop: '20px',
            boxSizing: 'border-box'
          }}>
            <div>
              <p>Vent :</p>
              <p style={styleValeur}>{vitesseVent} km/h</p>
              <p style={{ marginTop: '15px' }}>Production :</p>
              <p style={{...styleValeur}}>-- W</p>
            </div>

            <img 
              src={eolienne} 
              alt="Éolienne" 
              style={{ 
                flex: 1,              // L'image devient élastique et prend TOUTE la hauteur restante
                minHeight: 0,         
                width: '30%',        
                objectFit: 'contain', 
                alignSelf: 'center',  
                marginTop: '15px',
                justifySelf: 'bottom',
              }} 
            />

          </div>
        </div>

      </div>
    </div>
  );
}

// Petits styles réutilisables pour éviter de répéter
const styleBloc = {
  backgroundColor: '#ffffff',
  padding: '15px',
  borderRadius: '20px',
  border: '1px solid #f4dfc8',
  textAlign: 'left', 
};

const styleValeur = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#e67224',
  margin: '5px 0',
  paddingLeft: '30px'  
};

export default PageAccueil;