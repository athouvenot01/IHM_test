function Parametre({ date, heure, mode, setMode }) {
    const mode_expert = mode === 'expert';
    const mode_simple = mode === 'simple';

    return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', gap: '10px', flex: 1, boxSizing: 'border-box' }}>
      
      {/* --- SECTION DU HAUT 1 : Date --- */}
      <div style={{ 
        ...styleBloc, 
        padding: '15px 50px', 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <h2 style={{ margin: 0, fontSize: '35px' }}>Date :</h2>
        <p style={{ margin: 0, fontSize: '38px', fontWeight: 'bold', color: '#9e4728' }}>
          {date}
        </p>
      </div>
      
      {/* --- SECTION DU HAUT 2 : Heure --- */}
      <div style={{ 
        ...styleBloc, 
        padding: '15px 50px', 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <h2 style={{ margin: 0, fontSize: '35px' }}>Heure :</h2>
        <p style={{ margin: 0, fontSize: '38px', fontWeight: 'bold', color: '#9e4728' }}>
          {heure}
        </p>
      </div>

      {/* --- SECTION DU MILIEU : Bouton mode de l'interface --- */}
      <div style={{ 
        ...styleBloc, 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'flex-start', // Force le contenu à s'aligner vers le haut
        padding: '20px 25px',         // Ajusté pour que le titre colle bien en haut à gauche
        width: '90%',
        alignSelf: 'center',
      }}>
        
        {/* Titre calé en haut à gauche */}
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ margin: 0 }}>Mode utilisateur :</h2>
        </div>

        {/* Zone intermédiaire élastique qui prend tout le reste de la hauteur et centre son contenu */}
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          
          {/* --- CONTENEUR HORIZONTAL POUR METTRE CÔTE À CÔTE --- */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', width: '100%', justifyContent: 'center' }}>

              {/* BOUTON SIMPLE */}
              <div 
                  onClick={() => setMode('simple')} // Corrigé : utilise bien 'simple' pour activer ton bouton
                  style={{ 
                      cursor: 'pointer',                                
                      display: 'flex',
                      alignItems: 'center', 
                      justifyContent: 'center',                                            
                      backgroundColor: mode_simple ? '#9e4728' : '#ffffff',  
                      padding: '20px 15px',                                  
                      borderRadius: '15px', 
                      boxShadow: mode_simple ? '0px 0px 20px 1px #9e47283c' : 'none',          
                      border: mode_simple ? '2px solid #9e4728' : '1px solid #f4dfc8',                                              
                      transition: 'all 0.2s ease-out',  
                      flex: 1 
                  }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}        
                  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}             
                  >
                  <div style={{ textAlign: 'center' }}>
                      <h2 style={{ 
                      margin: 0, 
                      fontSize: '40px', 
                      color: mode_simple ? '#ffffff' : '#9e4728',
                      fontWeight: 'bold' 
                      }}>
                      {'Simple'}
                      </h2>
                  </div>
              </div>

              {/* BOUTON EXPERT */}
              <div 
                  onClick={() => setMode('expert')} // Synchro parfaite avec App.js
                  style={{ 
                      cursor: 'pointer',                                
                      display: 'flex',
                      alignItems: 'center', 
                      justifyContent: 'center',                                            
                      backgroundColor: mode_expert ? '#9e4728' : '#ffffff',  
                      padding: '20px 15px',                                  
                      borderRadius: '15px',                              
                      boxShadow: mode_expert ? '0px 0px 20px 1px #9e47283c' : 'none',          
                      border: mode_expert ? '2px solid #9e4728' : '1px solid #f4dfc8',                                              
                      transition: 'all 0.2s ease-out',  
                      flex: 1 
                  }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}        
                  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}             
                  >
                  <div style={{ textAlign: 'center' }}>
                      <h2 style={{ 
                      margin: 0, 
                      fontSize: '40px', 
                      color: mode_expert ? '#ffffff' : '#9e4728',
                      fontWeight: 'bold' 
                      }}>
                      {'Expert'}
                      </h2>
                  </div>
              </div>

          </div>
        </div> 
        
      </div>

      <div style={{ 
        ...styleBloc, 
        padding: '15px 50px', 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <h2 style={{ margin: 0, fontSize: '0.02%' }}>Pour plus d'informations</h2>
        <p style={{ margin: 0, fontSize: '38px', fontWeight: 'bold', color: '#9e4728' }}>
          {date}
        </p>
      </div>

    </div>
  );
}

const styleBloc = {
  backgroundColor: '#ffffff',
  padding: '20px',
  borderRadius: '20px',
  border: '1px solid #f4dfc8',
  boxSizing: 'border-box'
};

export default Parametre;