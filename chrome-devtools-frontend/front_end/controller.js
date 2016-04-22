console.log("Patching Runtime.experiments.supportEnabled ...");
// hack to enable experiments: see Runtime.js:Runtime.isEnabled()
Runtime.experiments.supportEnabled = () => true;

clearLocalStorage();
initServiceWorker();

selectPanel(Runtime.queryParam('panel'));


if (Runtime.queryParam('networkRequestsOnTimeline')) {
    console.debug("Patching localStorage.experiments.networkRequestsOnTimeline to show the network pane ...");
    var experiments = JSON.parse(window.localStorage['experiments'] || "{}");
    experiments.networkRequestsOnTimeline = true;
    window.localStorage['experiments'] = JSON.stringify(experiments);
    console.debug("Patching Runtime.experiments.localStorage to select the network pane ...");
    window.localStorage["timelineCaptureNetwork"] = true
} else {
    console.log("Tip: add networkRequestsOnTimeline=1 to your url to enable and select the Network option in the timeline");
}

console.debug("Hello, your controller ready to server you");


/**
 * Initialize the service worker
 */
function initServiceWorker () {
  if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js', { scope: '/chrome-devtools-frontend/front_end/' }).then(function(reg) {
          if(reg.installing) {
              console.log('Service worker installing');
          } else if(reg.waiting) {
              console.log('Service worker installed');
          } else if(reg.active) {
              console.log('Service worker active');
          }

      }).catch(function(error) {
          // registration failed
          console.log('Registration failed with ' + error);
      });
  };
}

/*
* if the good query param (panel) is passed and if the panel is a
* blessed panel, switch to it
*/
function selectPanel (panelName) {
    // to find all the panels:
    // find . -name "module.json" | xargs grep -e "name\|WebInspector.PanelFactory"
    const accessiblePanels = new Set([
        'network',
        'profiles',
        'timeline'
    ]);

    if (!panelName)
        return;

    if (accessiblePanels.has(panelName)) {
        window.localStorage['lastActivePanel'] = `"${panelName}"`;
    } else {
        console.error(`Can't switch to unhandled panel ${panelName}. Handled panels are: ${[...accessiblePanels].join(', ')}`);
    }

}


/*
* no persistence, the URL drives everything
*/
function clearLocalStorage () {
    window.localStorage.clear();
}
