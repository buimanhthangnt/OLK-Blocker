settings = {
    "active": false,
    "seen": false,
    "recseen": false,
    "type": false,
}

document.addEventListener("DOMContentLoaded", function(event) { 
    chrome.storage.local.get(['settings'], function(data) {
        if (!data.settings) {
            chrome.storage.local.set({"settings": JSON.stringify(settings)});
            saved_settings = settings;
        } else {
            saved_settings = JSON.parse(data.settings);
        }
        for (let key in saved_settings) {
            element = document.getElementById(key);
            element.checked = saved_settings[key];
            element.addEventListener('change', function(event) {
                saved_settings[key] = event.target.checked;
                chrome.storage.local.set({"settings": JSON.stringify(saved_settings)});
            });
        }
    });
});