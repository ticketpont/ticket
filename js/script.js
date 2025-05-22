// Fonction pour récupérer les paramètres URL dans un objet
function getUrlParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const pairs = queryString.split('&');
  for (const pair of pairs) {
    if (!pair) continue;
    const [key, value] = pair.split('=');
    if (key) params[key] = decodeURIComponent(value || '');
  }
  return params;
}

// Fonction pour échapper les caractères HTML spéciaux (pour éviter XSS)
function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/[&<>"']/g, function(m) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m];
  });
}

// Remplit les champs avec les valeurs sécurisées
function fillFields() {
  const params = getUrlParams();

  const fields = ['ad', 'tn', 'en', 'de', 'he', 'ep', 'sn', 'ds', 'hs', 'sp', 'pn'];

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = escapeHtml(params[id]) || '-';
    }
  });
}

// Fonction capture écran qui cache le bouton avant la capture
function setupScreenshotButton() {
  const btn = document.getElementById('screenshotBtn');
  const ticket = document.querySelector('.ticket');

  btn.addEventListener('click', () => {
    btn.style.visibility = 'hidden';

    html2canvas(ticket).then(canvas => {
    btn.style.visibility = 'visible';

    const params = getUrlParams();
    const tn = params['tn'] ? params['tn'].replace(/[^a-zA-Z0-9_-]/g, '') : 'inconnu';
    const id = params['id'] ? params['id'].replace(/[^a-zA-Z0-9_-]/g, '') : 'inconnu';

      canvas.toBlob(blob => {
        const link = document.createElement('a');
        link.download = `CU_${id}_${tn}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      });
    });
  });
}

// Initialisation après chargement DOM
window.addEventListener('DOMContentLoaded', () => {
  fillFields();
  setupScreenshotButton();
});
