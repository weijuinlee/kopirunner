(() => {
  const card = document.getElementById('install-card');
  const button = document.getElementById('install-app');
  const standalone = window.matchMedia('(display-mode: standalone)');
  let promptEvent = null;
  let dismissed = false;
  let installed = false;

  function render() {
    card.hidden = dismissed || installed || standalone.matches || navigator.standalone === true ||
      !promptEvent;
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    promptEvent = event;
    render();
  });
  window.addEventListener('appinstalled', () => {
    installed = true;
    promptEvent = null;
    render();
  });
  standalone.addEventListener('change', render);
  document.getElementById('dismiss-install').addEventListener('click', () => {
    dismissed = true;
    render();
  });
  button.addEventListener('click', async () => {
    if (!promptEvent) return;
    const event = promptEvent;
    promptEvent = null;
    button.disabled = true;
    try {
      await event.prompt();
      const choice = await event.userChoice;
      if (choice.outcome === 'accepted') installed = true;
    } catch (error) {
      console.warn('Installation prompt unavailable:', error);
    } finally {
      button.disabled = false;
      render();
    }
  });
  render();

  const connectionStatus = document.getElementById('connection-status');
  function showConnection() {
    connectionStatus.hidden = navigator.onLine;
    connectionStatus.textContent = 'You’re offline. You can keep taking orders on this device.';
  }
  window.addEventListener('online', showConnection);
  window.addEventListener('offline', showConnection);
  showConnection();

  if ('serviceWorker' in navigator && window.isSecureContext) {
    const updateNotice = document.getElementById('update-notice');
    const updateButton = document.getElementById('update-app');
    let waitingWorker;
    let requestedUpdate = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (requestedUpdate) window.location.reload();
    });
    updateButton.addEventListener('click', () => {
      if (!waitingWorker) return;
      requestedUpdate = true;
      updateButton.disabled = true;
      waitingWorker.postMessage({ type: 'ACTIVATE_UPDATE' });
    });
    navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).then((registration) => {
      function offerUpdate() {
        if (registration.waiting && navigator.serviceWorker.controller) {
          waitingWorker = registration.waiting;
          updateNotice.hidden = false;
        }
      }
      offerUpdate();
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', offerUpdate);
      });
    }).catch((error) => {
      console.warn('Offline support unavailable:', error);
    });
  }
})();
