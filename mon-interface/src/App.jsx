// *** Bibliothèques ***
import React from 'react';
import { useState, useEffect } from 'react';
import uibuilder from 'node-red-contrib-uibuilder/front-end/uibuilder.esm.js';

import BoutonLED from './BoutonLED';
import FlecheNavigation from './FlecheNavigation';
import PageAccueil from './PageAccueil';
import ConsoActuelle_VU from './ConsoActuelle_VU';
import PageRiceCooker from './PageRiceCooker';
import ModalRiceCooker from './ModalRiceCooker';
import Parametre from './Parametre';
import Conso_Expert_1 from './Conso_Expert_1';
import Conso_Expert_2 from './Conso_Expert_2';

import tournerTel from './dessin/0-tourner_tel.svg';

const nb_pages = 6;
const barres = Array.from({ length: nb_pages });

function App() {

  const [mesures, setMesures] = useState({
    vent: '--',
    vRice: 0, aRice: 0, pRice: 0, riceCooker: 0, tpsCuissonMin: 0, tpsMaintienMin: 0,
    maintienActif: false, maintienFinTs: 0,
    vFrigo: 0, aFrigo: 0, pFrigo: 0, frigo: 0,
    vLeds: 0, aLeds: 0, pLeds: 0,
    vUsbC: 0, aUsbC: 0, pUsbC: 0, usbC: 0,
    vUsbB: 0, aUsbB: 0, pUsbB: 0, usbB: 0,
    vMicro: 0, aMicro: 0, pMicro: 0,
    vBatterie: 0, aBatterie: 0, pBatterie: 0, soc: 0, autonomieH: 0, etatBatterie: 0, alerte: 0,
    vAtlernateur: 0, aAlternateur: 0, pAlternateur: 0,
    pTotal: 0
  });

  // Pop-up Rice Cooker (allumage hotte / cuisson refusée)
  const [popupRice, setPopupRice] = useState({ visible: false, type: 'hotte', message: '' });

  // ****************** GESTION NODE-RED ******************
  useEffect(() => {
    // FIX: Contournement du bug aléatoire (page blanche) uibuilder v7.6.2 en prod
    // causé par un uibuilder-webroot à undefined lors des requêtes HEAD.
    if (uibuilder.httpHeaders && typeof uibuilder.httpHeaders['uibuilder-webroot'] === 'undefined') {
      uibuilder.httpHeaders['uibuilder-webroot'] = "";
    }

    try {
      uibuilder.start();
    } catch (e) {
      console.warn("Erreur au démarrage de uibuilder:", e);
    }

      uibuilder.onChange('ioConnected', (estConnecte) => {
      if (estConnecte) {
        uibuilder.send({ topic: "fetchInitialState", payload: {} });
      }
    });

    uibuilder.onChange('msg', (nouveauMsg) => {
      if (!nouveauMsg) return;

      const unwrapPayload = (msg) => {
        if (!msg) return null;
        if (msg.payload && typeof msg.payload === 'object' && msg.payload !== msg) {
          return unwrapPayload(msg.payload);
        }
        return msg;
      };

      const payload = unwrapPayload(nouveauMsg);
      if (!payload) return;

      const topic = String(nouveauMsg.topic || payload.topic || '').toLowerCase().trim();

      if (payload.id === "vent") {
        setMesures((anciennes) => ({ ...anciennes, vent: payload.vitesse }));
      }

      if (payload.id === "alternateur") {
        setMesures((anciennes) => ({ ...anciennes, p_alternateur: payload.puissance ?? 0 }));
      }

      if (payload.id === "frigo") {
        setMesures((anciennes) => ({
          ...anciennes,
          vFrigo: payload.tension,
          aFrigo: payload.courant,
          pFrigo: payload.puissance,
          frigo: payload.etat
        }));
      }

      if (payload.id === "usbC") {
        setMesures((anciennes) => ({
          ...anciennes,
          vUsbC: payload.tension,
          aUsbC: payload.courant,
          pUsbC: payload.puissance,
          usbC: payload.etat
        }));
      }

      if (payload.id === "usbB") {
        setMesures((anciennes) => ({
          ...anciennes,
          vUsbB: payload.tension, aUsbB: payload.courant, pUsbB: payload.puissance, usbB: payload.etat
        }));
      }

      if (payload.id === "microControleur") {
        setMesures((anciennes) => ({
          ...anciennes,
          vMicro: payload.tension, aMicro: payload.courant, pMicro: payload.puissance
        }));
      }

      // Mise à jour : réception des données du rice cooker (état, consommation, temps de cuisson/maintien) pour la page "Rice Cooker"
      if (payload.id === "riceCooker") {
        setMesures((anciennes) => ({
          ...anciennes,
          vRice: payload.tension,
          aRice: payload.courant,
          pRice: payload.puissance,
          riceCooker: payload.etat,
          tpsCuissonMin: payload.tpsCuissonMin,
          tpsMaintienMin: payload.tpsMaintienMin,
          // Décompte du maintien au chaud piloté par le back-end
          maintienActif: payload.maintienActif ?? anciennes.maintienActif,
          maintienFinTs: payload.maintienFinTs ?? anciennes.maintienFinTs
        }));
      }

      // Pop-up Rice Cooker : "ALLUMER_HOTTE" (cuisson autorisée) ou "CUISSON_REFUSEE"
      if (payload.id === "riceCookerPopup") {
        setPopupRice({
          visible: true,
          type: payload.action === "CUISSON_REFUSEE" ? 'refus' : 'hotte',
          message: payload.message || ''
        });
      }
      // Ajout : réception des données de consommation pour la page "Conso Actuelle"
      if (payload.id === "bilanConso") {
        setMesures((anciennes) => ({
          ...anciennes,
          pTotal: payload.total || 0,
          pRice: payload.details?.riceCooker ?? anciennes.pRice,
          pUsbC: payload.details?.usbC ?? anciennes.pUsbC,
          pFrigo: payload.details?.frigo ?? anciennes.pFrigo,
          pLeds: payload.details?.leds ?? anciennes.pLeds,
          pUsbB: payload.details?.usbB ?? anciennes.pUsbB,
          pMicro: payload.details?.microControleur ?? anciennes.pMicro
        }));
      }

      if (payload.id === "batteriGlobale") {
        setMesures((anciennes) => ({
          ...anciennes,
          vBatterie: payload.tension ?? anciennes.tension,
          aBatterie: payload.courant ?? anciennes.courant,
          pBatterie: payload.puissance ?? anciennes.puissance,
          soc: payload.soc ?? anciennes.soc,
          autonomieH: payload.autonomieH ?? anciennes.autonomieH,
          etatBatterie: payload.etat ?? anciennes.etatBatterie,
          alerte: payload.alerte ?? anciennes.alerte
        }));
      }

      if (payload.id === "statutRelaisIhm") {
        const relais = payload.relais || {};

        setMesures((anciennes) => ({
          ...anciennes,
          riceCooker: relais.riceCooker ?? anciennes.riceCooker,
          usbC: relais.usbC ?? anciennes.usbC,
          frigo: relais.frigo ?? anciennes.frigo
        }));
      }

      if (payload.id === "eclairage") {
        const interrupteurs = payload.interrupteurs || {};
        const mesuresEclairage = payload.mesures || {};
        const relais = payload.relais || {};

        setMesures((anciennes) => ({
          ...anciennes,
          vLeds: mesuresEclairage.tension ?? anciennes.vLeds,
          aLeds: mesuresEclairage.courant ?? anciennes.aLeds,
          pLeds: mesuresEclairage.puissance ?? anciennes.pLeds,
          riceCooker: relais.riceCooker ?? anciennes.riceCooker,
          usbC: relais.usbC ?? anciennes.usbC,
          frigo: relais.frigo ?? anciennes.frigo
        }));
        
        setEtatLampes((ancienEtat) => {
          const k_new = interrupteurs.kuisine == 1 ? 'ON' : 'OFF';
          const s_new = interrupteurs.saloon == 1 ? 'ON' : 'OFF';
          const p_new = interrupteurs.pq == 1 ? 'ON' : 'OFF';
          const l_new = interrupteurs.livre == 1 ? 'ON' : 'OFF';

          if (
            ancienEtat.kuisine !== k_new ||
            ancienEtat.saloon !== s_new ||
            ancienEtat.pq !== p_new ||
            ancienEtat.livre !== l_new
          ) {
            return { kuisine: k_new, saloon: s_new, pq: p_new, livre: l_new };
          }
          return ancienEtat; 
        });
      }
    }); 

  }, []);


  // ****************** GESTION HEURE & DATE ******************
  const [heure, setHeure] = useState('--:--');
  useEffect(() => {
    const mettreAJourHeure = () => {
      const maintenant = new Date();
      const h = maintenant.getHours().toString().padStart(2, '0');
      const min = maintenant.getMinutes().toString().padStart(2, '0');
      setHeure(`${h}:${min}`);
    };
    mettreAJourHeure();
    const chrono = setInterval(mettreAJourHeure, 1000); 
    return () => clearInterval(chrono);
  }, []);

  const date = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });


  // ****************** GESTION DES LAMPES ******************
  const [etatLampes, setEtatLampes] = useState({
    kuisine: 'OFF', saloon: 'OFF', pq: 'OFF', livre: 'OFF'
  });

  const basculerLampe = (nom) => {
    const etatActuel = etatLampes[nom];
    const nouvelEtat = etatActuel === 'ON' ? 'OFF' : 'ON';

    setEtatLampes((prev) => ({ ...prev, [nom]: nouvelEtat }));

    uibuilder.send({
      topic: "commandeLed",
      payload: { led: nom, etat: nouvelEtat === 'ON' ? 1 : 0 }
    });
  };

  const basculerToutesLesLampes = () => {
    const auMoinsUneAllumee = etatLampes.kuisine === 'ON' || 
                              etatLampes.saloon === 'ON' || 
                              etatLampes.pq === 'ON' || 
                              etatLampes.livre === 'ON';

    const nouvelEtatTexte = auMoinsUneAllumee ? 'OFF' : 'ON';
    const nouvelEtatChiffre = auMoinsUneAllumee ? 0 : 1;

    setEtatLampes({
      kuisine: nouvelEtatTexte,
      saloon: nouvelEtatTexte,
      pq: nouvelEtatTexte,
      livre: nouvelEtatTexte
    });

    const nomsLampes = ['kuisine', 'saloon', 'pq', 'livre'];
    
    nomsLampes.forEach((nom, index) => {
      setTimeout(() => {
        uibuilder.send({
          topic: "commandeLed",
          payload: { led: nom, etat: nouvelEtatChiffre } 
        });
      }, index * 100); 
    });
  };

  // ****************** GESTION DES DELESTAGE ******************
  const basculerEquipement = (nom) => {
    const etatActuel = mesures[nom]; 
    const nouvelEtat = (etatActuel === 1 || etatActuel === 'ON') ? 0 : 1;

    uibuilder.send({
      topic: "commandeEquipement",
      payload: { appareil: nom, etat: nouvelEtat }
    });
  };


  // ****************** MODE & NAVIGATION ******************
  const [modeUtilisateur, setModeUtilisateur] = useState('simple');
  const [page, setPage] = useState(0);

  const pageSuivante = () => setPage((p) => (p < nb_pages - 1 ? p + 1 : 0));
  const pagePrecedente = () => setPage((p) => (p > 0 ? p - 1 : nb_pages - 1));

  const [clavierGaucheActif, setClavierGaucheActif] = useState(false);
  const [clavierDroiteActif, setClavierDroiteActif] = useState(false);

  useEffect(() => {
    const enfoncer = (e) => {
      if (e.key === "ArrowLeft") { setClavierGaucheActif(true); pagePrecedente(); }
      if (e.key === "ArrowRight") { setClavierDroiteActif(true); pageSuivante(); }
    };
    const relacher = (e) => {
      if (e.key === "ArrowLeft") setClavierGaucheActif(false);
      if (e.key === "ArrowRight") setClavierDroiteActif(false);
    };
    window.addEventListener("keydown", enfoncer);
    window.addEventListener("keyup", relacher);
    return () => {
      window.removeEventListener("keydown", enfoncer);
      window.removeEventListener("keyup", relacher);
    };
  }, [page]);


  // ****************** ORIENTATION ******************
  const [estPortrait, setEstPortrait] = useState(window.innerHeight > window.innerWidth);
  useEffect(() => {
    const detecterOrientation = () => setEstPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener('resize', detecterOrientation);
    return () => window.removeEventListener('resize', detecterOrientation);
  }, []);

  if (estPortrait) {
    return (
      <div style={{ height: '100vh', width: '100vw', backgroundColor: '#c09273', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', textAlign: 'center', padding: '20px', boxSizing: 'border-box' }}>
        <div style={{ width: '430px', height: '350px', backgroundColor: 'rgba(255, 255, 255, 0.27)', borderRadius: '20px', boxShadow: '0 10px 30px rgba(150, 84, 9, 0.42)', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <h1>Mode Paysage Requis</h1>
          <div style={{ marginBottom: '20px', marginTop: '20px' }}>
            <img src={tournerTel} alt="tourner l'appareil" style={{ width: '130px'}} />
          </div>
          <p><strong>Tournez l'écran</strong> pour continuer.</p>
        </div>
      </div>
    );
  }

  // ****************** AFFICHAGE PRINCIPAL ******************
  return (
    <div style={{ backgroundImage: 'linear-gradient(35deg, #fae4cd, #fef3e9)', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px', boxSizing: 'border-box' }}>
      <div style={{ width: '99%', height: '98%', maxWidth: '1280px', aspectRatio: '15/9', backgroundColor: 'rgba(255, 255, 255, 0.4)', borderRadius: '20px', border: 'rgba(156, 156, 156, 0.34) solid 1px', padding: '20px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

        <FlecheNavigation direction="gauche" auClic={pagePrecedente} estActive={clavierGaucheActif}/>
        <FlecheNavigation direction="droite" auClic={pageSuivante} estActive={clavierDroiteActif}/>

        <div style={{ width: 'calc(100% - 170px)', height: '95%', alignSelf: 'center', marginLeft: 'calc(170px / 2)', marginRight: 'calc(170px / 2)', backgroundColor: 'rgb(255, 255, 255)', borderRadius: '20px', border: '1px solid #9c9c9c57', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)', padding: '10px', display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>

          {page === 0 && (
            <section style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
              <h1>Accueil</h1>
              <div style={{ marginTop: '20px', flex: 1, display: 'flex'}}>
                <PageAccueil
                vitesseVent={mesures.vent}
                heure={heure}
                soc={mesures.soc}
                autonomieH={mesures.autonomieH}
                etatBatterie={mesures.etatBatterie}
                consoGlobale={mesures.pTotal}
                consoMicro={mesures.pMicro}
                productionAlternateur={mesures.pAlternateur}
              />
              </div>
            </section>
          )}

          {page === 1 && (
            <section style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
              <h1>Commande des Lumières</h1>
              <div style={{ display: 'grid', gridTemplateRows: 'repeat(2, 1fr)', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', flex: 1, paddingTop: '20px', boxSizing: 'border-box' }}>
                <BoutonLED name="Cuisine" status={etatLampes.kuisine} auClic={() => basculerLampe('kuisine')} />
                <BoutonLED name="Salon" status={etatLampes.saloon} auClic={() => basculerLampe('saloon')} />
                <BoutonLED name="Toilettes" status={etatLampes.pq} auClic={() => basculerLampe('pq')} />
                <BoutonLED name="Coin Lecture" status={etatLampes.livre} auClic={() => basculerLampe('livre')} />
              </div>
            </section>
          )}

          {page === 2 && (
            <section style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
              <h1>Rice Cooker</h1>
              <div style={{ marginTop: '20px', flex: 1, display: 'flex'}}>
                <PageRiceCooker
                  etatRiceCooker={mesures.riceCooker}
                  puissanceConso={mesures.pRice}
                  tpsCuissonMin={mesures.tpsCuissonMin}
                  tpsMaintienMin={mesures.tpsMaintienMin}
                  maintienActif={mesures.maintienActif}
                  maintienFinTs={mesures.maintienFinTs}
                />
              </div>
            </section>
          )}

          {page === 3 && (
            modeUtilisateur === 'expert' ? (
              <section style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
                <h1>Consommation Actuelle</h1>
                <div style={{ marginTop: '20px', flex: 1, display: 'flex'}}>
                  <Conso_Expert_2 
                    mesures={mesures}
                  />
                </div>
              </section>
            ) : (
            <section style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
              <h1>Consommation Actuelle</h1>
              <div style={{ marginTop: '20px', flex: 1, display: 'flex'}}>
                <ConsoActuelle_VU
                  pMicro={mesures.pMicro}
                  pRice={mesures.pRice}
                  pUsbB={mesures.pUsbB}
                  pUsbC={mesures.pUsbC}
                  pFrigo={mesures.pFrigo}
                  pLeds={mesures.pLeds}
                  pTotal={mesures.pTotal}
                  pMax={700}
                />
              </div>
            </section>
            )
          )}

          {page === 4 && (
            modeUtilisateur === 'expert' ? (
              <section style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
                <h1>Consommation Actuelle</h1>
                <div style={{ marginTop: '20px', flex: 1, display: 'flex'}}>
                  <Conso_Expert_1 
                    mesures={mesures} 
                    etatLampes={etatLampes} 
                    basculerLampe={basculerLampe} 
                    basculerToutesLesLampes={basculerToutesLesLampes}
                    basculerEquipement={basculerEquipement} 
                  />
                </div>
              </section>
            ) : (
              <section style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
                <h1>Mode Simple</h1>
              </section>
            )
          )}

          {page === 5 && (
            <section style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
              <h1>Paramètres</h1>
              <div style={{ marginTop: '20px', flex: 1, display: 'flex'}}>
                <Parametre date={date} heure={heure} mode={modeUtilisateur} setMode={setModeUtilisateur} />
              </div>
            </section>
          )}
        </div>

        <div style={{ display: 'flex', alignSelf: 'bottom', gap: '10px', justifyContent: 'center', marginTop: '25px', marginBottom: '0px', zIndex: nb_pages }}>
          {barres.map((_, i) => (
            <div key={i} style={{ 
              width: '20%',
              height: i === page ? '8px' : '4px',
              borderRadius: '4px',
              backgroundColor: i === page ? '#9e4728' : '#d2c5b6',
              transition: 'all 0.3s ease' }} />
          ))}
        </div>

        {/* Pop-up Rice Cooker (allumer la hotte / cuisson refusée) */}
        <ModalRiceCooker
          visible={popupRice.visible}
          type={popupRice.type}
          message={popupRice.message}
          onClose={() => setPopupRice((p) => ({ ...p, visible: false }))}
        />

      </div>
    </div>
  );
}
export default App;