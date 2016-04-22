console.log("Patching Runtime.experiments.supportEnabled ...");
// hack to enable experiments: see Runtime.js:Runtime.isEnabled()
Runtime.experiments.supportEnabled = () => true;

clearLocalStorage();

if (Runtime.queryParam('networkRequestsOnTimeline')) {
    console.log("Patching localStorage.experiments.networkRequestsOnTimeline to show the network pane ...");
    var experiments = JSON.parse(window.localStorage['experiments'] || "{}");
    experiments.networkRequestsOnTimeline = true;
    window.localStorage['experiments'] = JSON.stringify(experiments);
    console.log("Patching Runtime.experiments.localStorage to select the network pane ...");
    window.localStorage["timelineCaptureNetwork"] = true
}

console.log("Hello, your controller ready to server you");


/*
* no persistence, the URL drives everything
*/
function clearLocalStorage () {
    window.localStorage.clear();
}
