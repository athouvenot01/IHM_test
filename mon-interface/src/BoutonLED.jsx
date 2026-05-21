function BoutonLED({ name, status, auClic }) { // On ajoute "auClic" dans les props
  const allume = status === 'ON';
  
  return (
    <div 
      onClick={auClic}                                    // Quand clique, on appelle la fonction reçue
      style={{ 
        cursor: 'pointer',                                // Change le curseur pour montrer que c'est cliquable
        display: 'flex',
        alignItems: 'center', 
        justifyContent: 'space-between',                            
        backgroundColor: allume ? '#fefdf9' : 'white',  // Couleur de fond selon l'état
        padding: '20px 15px',                                  // Marge interne
        borderRadius: '15px',                             // Bords arrondis 
        boxShadow: allume ? '0px 0.5px 20px -5px #c4781538' : 'none',         // Ombre 
        border: '1px solid #f4dfc8',                             // Centrer le contenu
        transition: 'all 0.2s ease-out',  
      }}
      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}        // Effet de "pression" au clic
      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}             // Revenir à la taille normale après le clic  
    >
      {/* --- BLOC TEXTE (À GAUCHE) --- */}
      <div style={{ textAlign: 'left' }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: '40px', 
          color: '#1a1a1a',
          fontWeight: 'bold' 
        }}>
          {name}
        </h2>
        <p style={{ 
          margin: '5px 0 0 0', 
          color: '#767573', 
        }}>
          {allume ? 'Allumée' : 'Éteinte'}
        </p>
      </div>
      
      {/* --- BLOC DESSIN (À DROITE) --- */}
      <div style={{ 
        fontSize: '35px',
        backgroundColor: allume ? '#f9d6a1' : '#e5e5ea', // Petit fond rond derrière l'icône
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '15px',
        boxShadow: allume ? '0 0 5px rgba(211, 140, 63, 0.3)' : 'none'
      }}>
        {allume ? '💡' : '⚫'}
      </div>
    </div>
  );
}

export default BoutonLED;