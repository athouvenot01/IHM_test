/**
 * Mock de uibuilder pour le développement local
 * Le vrai uibuilder sera disponible quand l'app tournera via Node-RED
 */

const mockUibuilder = {
  // État interne
  _listeners: {},
  _data: {},

  // Initialiser la connexion
  start: function() {
    console.log('✓ uibuilder démarré (MODE MOCK - dev local)');
  },

  // Envoyer des données à Node-RED
  send: function(msg) {
    console.log('📤 Message envoyé à Node-RED:', msg);
    // En dev local, ça ne fait rien. En production via Node-RED, ce sera vrai.
  },

  // Écouter les changements
  onChange: function(topic, callback) {
    console.log(`✓ Écouteur activé pour: ${topic} (MODE MOCK)`);
    
    if (!this._listeners[topic]) {
      this._listeners[topic] = [];
    }
    this._listeners[topic].push(callback);
  },

  // Émettre un événement (pour tester)
  emit: function(topic, data) {
    if (this._listeners[topic]) {
      this._listeners[topic].forEach(callback => callback(data));
    }
  },

  // Méthode pour tester avec des données simulées (optionnel)
  simulateMessage: function(topic, payload) {
    console.log(`📨 Simulation - Topic: ${topic}, Payload:`, payload);
    this.emit(topic, { topic, payload });
  }
};

export default mockUibuilder;
