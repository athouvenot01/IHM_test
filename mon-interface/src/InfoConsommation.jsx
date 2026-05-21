function InfoConsommation({ name, puissance, icone}) { 
  
  return (
    <div style={{ 
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: '20px 15px',
        borderRadius: '15px',
        border: '1px solid #f4dfc8',
        height: '100%', // Pour remplir la cellule de la grille
        boxSizing: 'border-box'
      }}
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
        <p style={{ margin: '5px 0 0 0', fontSize: '24px', color: '#e67224', fontWeight: 'bold' }}>
          {puissance} W
        </p>
      </div>
      
      {/* --- BLOC DESSIN (À DROITE) --- */}
      <div style={{ 
        fontSize: '35px',
        backgroundColor: '#f9d6a1', // Petit fond rond derrière l'icône
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '15px',
        //boxShadow: allume ? '0 0 5px rgba(211, 140, 63, 0.3)' : 'none'
      }}>
        {icone}
      </div>
    </div>
  );
}

export default InfoConsommation;