var data = {},
	options = {};

function optionsChangedListener() {
	chrome.storage.sync.get('apikey', function(value) {
		options = value;
		getUserInformation();
	});
}

function getUserInformation() {
	//todo remove dependency to jquery
	$.ajax({
		type: 'GET',
		url: 'https://bitminter.com/api/users',
		headers: {
			Authorization: 'key=' + options.apikey
		},
		success: function(newData) {
			data = newData;
			sendData();
		},
		error: function() {
			data = {};
			sendData();
		}
	});
}

function sendData() {
	chrome.browserAction.setBadgeText({text: String(getHashRate(parseFloat(data.hash_rate)))});

	var views = chrome.extension.getViews();

	for (var i = 0; i < views.length; i++) {
		var view = views[i];

		view.data = data;
		view.options = options;
		view.update();
	}
}

function popupOpened() {
	sendData();
}

function getHashRate(rate) {
	while(rate > 1000) {
		rate /= 1000;
	}
	return Math.floor(rate);
}

function update() {
}

function run() {
	chrome.storage.onChanged.addListener(optionsChangedListener);
	optionsChangedListener();	

	chrome.browserAction.onClicked.addListener(popupOpened);

	window.setInterval(getUserInformation, 5000);
}

run();