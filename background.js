let active = [
    new RegExp(/https:\/\/\d*-edge-chat\.facebook\.com\/(.)*/g),
    new RegExp(/https:\/\/\d*-edge-chat\.messenger\.com\/(.)*/g)
];
let seen = [
    new RegExp(/https:\/\/www\.facebook\.com\/ajax\/mercury\/change_read_status\.php(.)*/g),
    new RegExp(/https:\/\/www\.messenger\.com\/ajax\/mercury\/change_read_status\.php(.)*/g)
];
let recseen = [
    new RegExp(/https:\/\/www\.facebook\.com\/ajax\/mercury\/change_read_status\.php(.)*/g),
    new RegExp(/https:\/\/www\.messenger\.com\/ajax\/mercury\/change_read_status\.php(.)*/g),
    new RegExp(/https:\/\/www\.facebook\.com\/ajax\/mercury\/delivery_receipts\.php(.)*/g),
    new RegExp(/https:\/\/www\.messenger\.com\/ajax\/mercury\/delivery_receipts\.php(.)*/g),
]
let type = [
    new RegExp(/https:\/\/www\.facebook\.com\/ajax\/messaging\/typ\.php(.)*/g),
    new RegExp(/https:\/\/www\.messenger\.com\/ajax\/messaging\/typ\.php(.)*/g)
]

domains = {active, seen, recseen, type}
settings = null

chrome.storage.local.get(['settings'], function(data) {
    if (!data.settings) {
        settings = {
            "active": false,
            "seen": false,
            "recseen": false,
            "type": false,
        }
    } else {
        settings = JSON.parse(data.settings);
    }
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
        if (key == "settings") {
            settings = JSON.parse(changes[key].newValue);
        }
    }
});

function is_blocked(url) {
    block = false;
    for (let key in settings) {
        if (settings[key] == true) {
            domains[key].forEach(patt => {
                if (patt.test(url) == true) block = true;
            });
        }
    }
    return block;
}

chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
		return {cancel: is_blocked(details.url) };
	},
	{urls: ["<all_urls>"]},
	["blocking"]
);