import React from 'react';

/**
 * Fenêtre pop-up modale pour le Rice Cooker.
 *
 * Deux types d'affichage pilotés par le back-end (Node-RED) :
 *  - type "hotte" : la cuisson est autorisée -> on rappelle d'allumer la hotte (ventilation).
 *  - type "refus" : la batterie ne permet pas de lancer la cuisson (relais laissé/forcé ouvert).
 *
 * Props :
 *  - visible : booléen, affiche ou non la modale.
 *  - type    : "hotte" | "refus".
 *  - message : texte optionnel envoyé par le back-end (sinon texte par défaut).
 *  - onClose : callback de fermeture (bouton "OK").
 */
function ModalRiceCooker({ visible, type, message, onClose }) {
  if (!visible) return null;

  const estRefus = type === 'refus';

  const couleurAccent = estRefus ? '#c0392b' : '#e67224';
  const titre = estRefus ? 'Cuisson impossible' : 'Allumez la hotte';
  const icone = estRefus ? '⚠️' : '🌀';
  const texteParDefaut = estRefus
    ? "La batterie ne permet pas de lancer une cuisson pour le moment. Le relais reste coupé."
    : "La cuisson va démarrer. Pensez à allumer la hotte (ventilation) avant de cuisiner.";

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(60, 40, 20, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        borderRadius: '20px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '60%',
          maxWidth: '560px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: `2px solid ${couleurAccent}`,
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
          padding: '35px 40px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '18px'
        }}
      >
        <div style={{ fontSize: '70px', lineHeight: 1 }}>{icone}</div>

        <h2 style={{ margin: 0, fontSize: '40px', color: couleurAccent }}>{titre}</h2>

        <p style={{ margin: 0, fontSize: '26px', color: '#3d3d3d', lineHeight: 1.4 }}>
          {message || texteParDefaut}
        </p>

        <button
          onClick={onClose}
          style={{
            marginTop: '10px',
            padding: '14px 50px',
            fontSize: '26px',
            fontWeight: 'bold',
            color: '#ffffff',
            backgroundColor: couleurAccent,
            border: 'none',
            borderRadius: '14px',
            cursor: 'pointer'
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default ModalRiceCooker;
