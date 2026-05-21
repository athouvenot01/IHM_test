 // *** Bilbiothèques ***
  import React from 'react';                // Bibliothèque de base pour créer des composants React
  import { useState,useEffect } from 'react';             // Bibliothèque pour avoir des boutons interactifs
  import uibuilder from 'node-red-contrib-uibuilder/front-end/uibuilder.esm.js';        // Bibliothèque pour communiquer avec Node-RED

  import BoutonLED from './BoutonLED';                    // Import de l'objet BoutonLED
  import FlecheNavigation from './FlecheNavigation';      // Import de l'objet FlecheNavigation
  import InfoConsommation from './InfoConsommation';      // Import de l'objet InfoConsommation
  import PageAccueil from './PageAccueil';                // Import de l'objet PageAccueil
  import ConsoActuelle_VU from './ConsoActuelle_VU';      // Import de l'objet ConsoActuelle_VU
  import PageRiceCooker from './PageRiceCooker';          // Import de l'objet PageRiceCooker
  import Parametre from './Parametre';                    // Import de l'objet Parametre

  // ****************** Dessin **********************
  import tournerTel from './dessin/0-tourner_tel.svg';

  // ****************** DEFINITION DES CONSTANTES POUR LA GESTION DES PAGES ******************
  const nb_pages = 6;
  const barres = Array.from({ length: nb_pages });            // Tableau pour les barres de navigation



  function App() {

    const [mesures, setMesures] = useState({
        tension: 0,
        puissance: 0,
        autonomie: 0,
        consoUSB: 0,
        vent: '--',
        v_frigo: 0,
        a_frigo: 0,
        p_frigo: 0,
        frigo: 0,
        v_rice: 0,
        a_rice: 0,
        p_rice: 0,
        rice: 0
        // ... toutes tes autres variables
    });

    // Initialisation de la connexion avec Node-RED au chargement
    useEffect(() => {
      uibuilder.start();

      uibuilder.onChange('msg', (nouveauMsg) => {
        console.log('🔴 ============ MESSAGE BRUT REÇU =============');
        console.log('Contenu complet:', nouveauMsg);
        console.log('Topic:', nouveauMsg?.topic);
        console.log('Payload:', nouveauMsg?.payload);
        console.log('Payload.id:', nouveauMsg?.payload?.id);
        console.log('✅ ============================================');

        if (!nouveauMsg || !nouveauMsg.payload) {
          console.warn('⚠️ Message vide ou sans payload:', nouveauMsg);
          return;
        }

        const payload = nouveauMsg.payload;
        const messageId = String(payload.id || '').toLowerCase().trim(); 
        const topic = String(nouveauMsg.topic || '').toLowerCase().trim();

        console.log('📨 Message traité - Topic:', topic, '- ID détecté:', messageId); 

        // ✅ TRAITEMENT SPÉCIAL : Si c'est une commande LED qui revient en BROADCAST de Node-RED
        if (topic === "commande_led" && payload.led) {
          console.log('🔄 BROADCAST LED reçu! Mise à jour locale:', { led: payload.led, etat: payload.etat });
          
          setEtatLampes((ancienEtat) => {
            const k_new = payload.etat === 1 || payload.etat === '1' ? 'ON' : 'OFF';
            const nouvelEtat = {
              ...ancienEtat,
              [payload.led]: k_new
            };
            console.log('💡 État LED mis à jour après broadcast:', nouvelEtat);
            return nouvelEtat;
          });
          return; // Important : on sort après le traitement
        }

        // Interception de la vitesse du vent
        if (messageId === "vent") {
          setMesures((anciennesMesures) => ({
            ...anciennesMesures,
            vent: payload
          }));
        }

        if (messageId === "frigo") {
          setMesures((anciennesMesures) => ({
            ...anciennesMesures,
            v_frigo: payload.tension,
            a_frigo: payload.courant,
            p_frigo: payload.puissance,
            frigo: payload.etat
          }));
        }

        if (messageId === "rice_cooker") {
          setMesures((anciennesMesures) => ({
            ...anciennesMesures,
            v_rice: payload.tension,
            a_rice: payload.courant,
            p_rice: payload.puissance,
            rice: payload.etat
          }));
        }

        if (messageId === "eclairage") {
          console.log('💡 Mise à jour de l\'éclairage reçue (BROADCAST):', payload);
          
          // ✅ Les données sont dans payload.interrupteurs !
          const interrupteurs = payload.interrupteurs || {};
          
          setEtatLampes((ancienEtat) => {
            const k_new = interrupteurs.kuisine === 1 || interrupteurs.kuisine === '1' ? 'ON' : 'OFF';
            const s_new = interrupteurs.saloon === 1 || interrupteurs.saloon === '1' ? 'ON' : 'OFF';
            const p_new = interrupteurs.pq === 1 || interrupteurs.pq === '1' ? 'ON' : 'OFF';
            const l_new = interrupteurs.livre === 1 || interrupteurs.livre === '1' ? 'ON' : 'OFF';

            const nouvelEtat = {
              kuisine: k_new,
              saloon: s_new,
              pq: p_new,
              livre: l_new
            };

            if (
              ancienEtat.kuisine !== k_new ||
              ancienEtat.saloon !== s_new ||
              ancienEtat.pq !== p_new ||
              ancienEtat.livre !== l_new
            ) {
              console.log('🔄 État des lampes mis à jour (serveur):', { ancien: ancienEtat, nouveau: nouvelEtat });
              return nouvelEtat;
            } else {
              console.log('ℹ️ État des lampes inchangé');
            }

            return ancienEtat; 
          });

          // ✅ NETTOYAGE DES OVERRIDES : Quand le broadcast revient, on supprime l'override local
          setOverrideLampes(prev => {
            const next = { ...prev };
            // Si l'override local correspond à l'état serveur, on le supprime (sync complète)
            if (next.kuisine === (interrupteurs.kuisine === 1 ? 'ON' : 'OFF')) delete next.kuisine;
            if (next.saloon === (interrupteurs.saloon === 1 ? 'ON' : 'OFF')) delete next.saloon;
            if (next.pq === (interrupteurs.pq === 1 ? 'ON' : 'OFF')) delete next.pq;
            if (next.livre === (interrupteurs.livre === 1 ? 'ON' : 'OFF')) delete next.livre;
            console.log('🧹 Overrides nettoyés après sync:', next);
            return next;
          });
        }

      }); 

    }, []);


    // ****************** GESTION DE L'HEURE ******************
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

      return () => clearInterval(chrono);                     // Nettoyage si on change de page
    }, []);


    const date = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
   

    // ****************** GESTION DES LAMPES ******************

    // *** Mémoire de l'état des lampes (ON/OFF) ***
    const [etatLampes, setEtatLampes] = useState({
      kuisine: 'OFF',
      saloon: 'OFF',
      pq: 'OFF',
      livre: 'OFF'
    });

    const [overrideLampes, setOverrideLampes] = useState({});

    const basculerLampe = (nom) => {
      const etatActuel = etatLampes[nom];
      const nouvelEtatLumiere = etatActuel === 'ON' ? 'OFF' : 'ON';
      const valeurEtat = nouvelEtatLumiere === 'ON' ? 1 : 0;

      // ✅ OVERRIDE IMMÉDIAT : Affiche le changement tout de suite sur cet ordinateur
      setOverrideLampes(prev => ({
        ...prev,
        [nom]: nouvelEtatLumiere
      }));

      const commande = {
        topic: "commande_led", 
        payload: {
          led: nom,  
          etat: valeurEtat    
        }
      };

      console.log('📤 Envoi commande à Node-RED:', commande);
      console.log('💡 Override LOCAL appliqué immédiatement:', { [nom]: nouvelEtatLumiere });
      
      uibuilder.send(commande);
    };




    // ****************** GESTION DU MODE UTILISATEUR **********************
    const [modeUtilisateur, setModeUtilisateur] = useState('simple');


    // ****************** GESTION DES PAGES ******************

    // *** Mémoire de la page courante (0 = page d'accueil) ***
    const [page, setPage] = useState(0);

    // *** Fonctions pour changer de page (suivante/précédente) ***
    const pageSuivante = () =>
      setPage((p) => (p < nb_pages - 1 ? p + 1 : 0));                              // Boucle croissante, revient à la page 0 après la page 4
    const pagePrecedente = () =>
      setPage((p) => (p > 0 ? p - 1 : nb_pages - 1));                              // Boucle décroissante, revient à la page 4 après la page 0

    // *** Fonction pour changer de page avec les touches du clavier ***
    const [clavierGaucheActif, setClavierGaucheActif] = useState(false);
    const [clavierDroiteActif, setClavierDroiteActif] = useState(false);

    useEffect(() => {
      const enfoncer = (e) => {
        if (e.key === "ArrowLeft") {
          setClavierGaucheActif(true);
          pagePrecedente();
        }
        if (e.key === "ArrowRight") {
          setClavierDroiteActif(true);
          pageSuivante();
        }
      };
      const relacher = (e) => {
        if (e.key === "ArrowLeft") setClavierGaucheActif(false);
        if (e.key === "ArrowRight") setClavierDroiteActif(false);
      };
      window.addEventListener("keydown", enfoncer);                   // Écoute la pression des touches du clavier
      window.addEventListener("keyup", relacher);                     // Écoute la relâche des touches du clavier

      return () => {
        window.removeEventListener("keydown", enfoncer);              // Nettoie pour ne pas cumuler les écoutes
        window.removeEventListener("keyup", relacher);                // Nettoie pour ne pas cumuler les écoutes
      };
    }, [page]);                                                       // Redémarre l'écouteur si la page est mise à jour



    // ****************** CONDITION SUR L'ORIENTATION DE L'INTERFACE ******************
    const [estPortrait, setEstPortrait] = useState(window.innerHeight > window.innerWidth);
    useEffect(() => {
      const detecterOrientation = () => {
        setEstPortrait(window.innerHeight > window.innerWidth);
      };

      window.addEventListener('resize', detecterOrientation);
      return () => window.removeEventListener('resize', detecterOrientation);
    }, []);

    if (estPortrait) {
      return (
        <div style={{
          height: '100vh',
          width: '100vw',
          backgroundColor: '#c09273',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            width: '430px',
            height: '350px',
            backgroundColor: 'rgba(255, 255, 255, 0.27)',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(150, 84, 9, 0.42)',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <h1>Mode Paysage Requis</h1>
            <div style={{ marginBottom: '20px', marginTop: '20px' }}>
              <img src={tournerTel} alt="tourner l'appareil" style={{ width: '130px'}} />
            </div>
            <p><strong>Tournez l'écran</strong> pour continuer.</p>
          </div>
        </div>
      );
    }


    // ****************** GESTION DE L'AFFICHAGE DE L'INTERFACE ******************

    // *** Définition du style de fond de l'interface ***
    return (
      <div style={{
        backgroundImage: 'linear-gradient(35deg, #fae4cd, #fef3e9)',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5px',
        boxSizing: 'border-box'
      }}>

        {/*** Définition du cadre contenant les informations ***/}
        <div style={{
          width: '99%',
          height: '98%',
          maxWidth: '1280px',
          aspectRatio: '15/9',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          borderRadius: '20px',
          border: 'rgba(156, 156, 156, 0.34) solid 1px',
          //boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingBottom: '20px',
          paddingTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}>

          {/* --- FLÈCHES DE NAVIGATION --- */}
          <FlecheNavigation
            direction="gauche"
            auClic={pagePrecedente}
            estActive={clavierGaucheActif}/>
          <FlecheNavigation
            direction="droite"
            auClic={pageSuivante}
            estActive={clavierDroiteActif}/>

          {/* --- CONTENU PRINCIPAL --- */}
          <div style={{
            width: 'calc(100% - 170px)',
            height: '95%',
            alignSelf: 'center',
            marginLeft: 'calc(170px / 2)',
            marginRight: 'calc(170px / 2)',
            backgroundColor: 'rgb(255, 255, 255)',
            borderRadius: '20px',
            border: '1px solid #9c9c9c57',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>

            {/* --- CONTENU DES PAGES --- */}

                {/**  PAGE 0  **/}
            {page === 0 && (
              <section style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%'
              }}>
                <h1>Accueil</h1>
                <div style={{ marginTop: '20px', flex: 1, display: 'flex'}}>
                  <PageAccueil vitesseVent={mesures.vent} heure={heure} />
                </div>
              </section>
            )}

                {/**  PAGE 1  **/}
            {page === 1 && (
              <section style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%'
              }}>
                <h1>Commande des Lumières</h1>
                <div style={{ display: 'grid', gridTemplateRows: 'repeat(2, 1fr)', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', flex: 1, paddingTop: '20px', boxSizing: 'border-box' }}>
                  {/* ✅ Affiche l'override en priorité (affichage local immédiat), sinon l'état serveur */}
                  <BoutonLED name="Kuisine" status={overrideLampes.kuisine !== undefined ? overrideLampes.kuisine : etatLampes.kuisine} auClic={() => basculerLampe('kuisine')} />
                  <BoutonLED name="Saloon" status={overrideLampes.saloon !== undefined ? overrideLampes.saloon : etatLampes.saloon} auClic={() => basculerLampe('saloon')} />
                  <BoutonLED name="PQ" status={overrideLampes.pq !== undefined ? overrideLampes.pq : etatLampes.pq} auClic={() => basculerLampe('pq')} />
                  <BoutonLED name="Livre" status={overrideLampes.livre !== undefined ? overrideLampes.livre : etatLampes.livre} auClic={() => basculerLampe('livre')} />
                </div>
              </section>
            )}

                {/**  PAGE 2  **/}
            {page === 2 && (
              <section style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%'
              }}>
                <h1>Rice Cooker</h1>
                <div style={{ marginTop: '20px', flex: 1, display: 'flex'}}>
                  <PageRiceCooker/>
                </div>
              </section>
            )}

                {/**  PAGE 3  **/}
            {page === 3 && (
              <section style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%'
              }}>
                <h1>Consommation Actuelle</h1>
                <div style={{ marginTop: '20px', flex: 1, display: 'flex'}}>
                  <ConsoActuelle_VU/>
                </div>
              </section>
            )}

                {/**  PAGE 4  **/}
            {page === 4 && (
              <section>
                <h1>Historique</h1>
                <p>Profil utilisateur</p>
              </section>
            )}

                {/**  PAGE 5  **/}
            {page === 5 && (
              <section style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%'
              }}>
                <h1>Paramètres</h1>
                <div style={{ marginTop: '20px', flex: 1, display: 'flex'}}>
                  <Parametre date={date} heure={heure} mode={modeUtilisateur} setMode={setModeUtilisateur} />
                </div>
              </section>
            )}
          </div>


          {/* --- BANDEAU DE NAVIGATION --- */}
          <div style={{
            display: 'flex',
            alignSelf: 'bottom',
            gap: '10px',
            justifyContent: 'center',
            marginTop: '25px',
            marginBottom: '0px',
            zIndex: nb_pages
          }}>
            {barres.map((_, i) => (
              <div
                key={i}
                style={{
                  width: '20%',
                  height: i === page ? '8px' : '4px',
                  borderRadius: '4px',
                  backgroundColor: i === page ? '#9e4728' : '#d2c5b6',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>

        </div>

      </div>
    );
  }
  export default App;