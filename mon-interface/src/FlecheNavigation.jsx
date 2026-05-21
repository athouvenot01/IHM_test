import { useState } from 'react';                             // Bibliothèque pour avoir des boutons interactifs

import flecheGauche from './dessin/0-fleche_gauche.svg';
import flecheDroite from './dessin/0-fleche_droite.svg';

function FlecheNavigation({ direction, auClic, estActive }) {     // On ajoute "estActive" dans les props pour savoir si la flèche est activée par le clavier

  const estGauche = direction === 'gauche';                   // Vrai si la direction est "gauche", sinon faux (pour la mise en page)
  const [estSurvole, setEstSurvole] = useState(false);
  const [estAppuye, setEstAppuye] = useState(false);


  const styleFleche = {
    position: 'absolute',
    top: '50%',
    height: '200px',
    transform: 'translateY(-50%)',        // Centrage vertical parfait
    padding: '10px 10px',
    fontSize: '24px',
    cursor: 'pointer',
    borderRadius: '15px',
    border: '#9c9c9c57 solid 1px',
    backgroundColor: (estAppuye || estActive) ? '#e67224' : (estSurvole ? '#fae4cd' : 'rgb(255, 255, 255)'),
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    transform: `translateY(-50%) scale(${(estAppuye || estActive) ? 0.9 : 1})`,
    transition: 'transform 0.1s ease',    // Pour que l'effet scale soit fluide
    zIndex: 100,                          // Pour être sûr que la flèche soit au-dessus du reste
    left: estGauche ? '20px' : 'auto',
    right: estGauche ? 'auto' : '20px',

  };



  return (

    <button
      onClick={auClic}
      style={styleFleche}        

      onMouseDown={() => setEstAppuye(true)}
      onMouseUp={() => setEstAppuye(false)}

      onMouseEnter={() => setEstSurvole(true)}
      onMouseLeave={() => setEstSurvole(false)}
    >
      <img src={estGauche ? flecheGauche : flecheDroite} alt="flèche" style={{ width: '50px', height: '50px' }} />
    </button>

  );

}



export default FlecheNavigation;