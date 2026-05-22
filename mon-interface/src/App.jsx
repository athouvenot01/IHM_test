// *** Bibliothèques ***
import React from 'react';
import { useState, useEffect } from 'react';
import uibuilder from 'node-red-contrib-uibuilder/front-end/uibuilder.esm.js';

import BoutonLED from './BoutonLED';
import FlecheNavigation from './FlecheNavigation';
import PageAccueil from './PageAccueil';
import ConsoActuelle_VU from './ConsoActuelle_VU';
import PageRiceCooker from './PageRiceCooker';
import Parametre from './Parametre';

import tournerTel from './dessin/0-tourner_tel.svg';

const nb_pages = 6;
const barres = Array.from({ length: nb_pages });

function App() {

  const [mesures, setMesures] = useState({
    tension: 0, puissance: 0, autonomie: 0, consoUSB: 0,
    vent: '--',
    v_frigo: 0, a_frigo: 0, p_frigo: 0, frigo: 0,
    v_rice: 0, a_rice: 0, p_rice: 0, rice: 0
  });

  // ****************** GESTION NODE-RED ******************
  useEffect(() => {
    uibuilder.start();

      uibuilder.onChange('ioConnected', (estConnecte) => {
      if (estConnecte) {
        uibuilder.send({ topic: "fetch_initial_state", payload: {} });
      }
    });

    uibuilder.onChange('msg', (nouveauMsg) => {
      if (!nouveauMsg || !nouveauMsg.payload) return;

      const payload = nouveauMsg.payload;
      const topic = String(nouveauMsg.topic || '').toLowerCase().trim();

      if (payload.id === "vent") {
        setMesures((anciennes) => ({ ...anciennes, vent: payload.vitesse }));
      }

      if (payload.id === "frigo") {
        setMesures((anciennes) => ({
          ...anciennes,
          v_frigo: payload.tension, a_frigo: payload.courant, p_frigo: payload.puissance, frigo: payload.etat
        }));
      }

      if (payload.id === "rice_cooker") {
        setMesures((anciennes) => ({
          ...anciennes,
          v_rice: payload.tension, a_rice: payload.courant, p_rice: payload.puissance, rice: payload.etat
        }));
      }

      if (payload.id === "eclairage") {
        const interrupteurs = payload.interrupteurs || {};
        
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
      topic: "commande_led", 
      payload: { led: nom, etat: nouvelEtat === 'ON' ? 1 : 0 }
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
                <PageAccueil vitesseVent={mesures.vent} heure={heure} />
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
                <BoutonLED name="Livre" status={etatLampes.livre} auClic={() => basculerLampe('livre')} />
              </div>
            </section>
          )}

          {page === 2 && (
            <section style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
              <h1>Rice Cooker</h1>
              <div style={{ marginTop: '20px', flex: 1, display: 'flex'}}>
                <PageRiceCooker/>
              </div>
            </section>
          )}

          {page === 3 && (
            <section style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
              <h1>Consommation Actuelle</h1>
              <div style={{ marginTop: '20px', flex: 1, display: 'flex'}}>
                <ConsoActuelle_VU p_micro={10} p_rice={100} p_usb_b={25} p_usb_c={30} p_frigo={75} p_leds={17} p_total={257} p_max={300} />
              </div>
            </section>
          )}

          {page === 4 && (
            <section>
              <h1>Historique</h1>
              <p>Profil utilisateur</p>
            </section>
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

      </div>
    </div>
  );
}
export default App;