var options = {},
	data = {};

function start() {
	$(document).ready(onload);
}	

function optionsChangedListener() {
	chrome.storage.sync.get('apikey', function(value) {
		localStorage['options'] = JSON.stringify(options);
		options = value;
		reset();
	});
}

function reset() {
	if(!options.apikey || !options.apikey.length) {
		//todo change this
		$(document.body).append('API key must be set from the options page');		
	} else {
		getUserInformation();
	}
}

function getUserInformation() {
	$.ajax({
		type: 'GET',
		url: 'https://bitminter.com/api/users',
		headers: {
			Authorization: 'key=' + options.apikey
		},
		success: function(newData) {
			localStorage['data'] = JSON.stringify(newData);
			data = newData;
			updateUserInformation();
			updateCurrentPage();
		}
	});
}

function updateUserInformation() {
	$('#username').text(data.name);
}

function updateCurrentPage() {
	updateGeneralPage();
}

//--------------------------------------------------------------------------

function updateGeneralPage() {
	var rate = convertHashRate(parseFloat(data.hash_rate));

	$("#hash_rate").text(rate.val);
	$("#hash_rate_suffix").text(rate.suffix);
}

function createGeneralPage() {

}

//--------------------------------------------------------------------------

function updateWorkerPage() {

}

function createWorkerPage() {

}

//--------------------------------------------------------------------------

function convertHashRate(value) {
	var suffix = 'MH/s';

	if (value > 1000) {
		value /= 1000;
		suffix = 'GH/s';
	}

	if (value > 1000) {
		value /= 1000;
		suffix = 'TH/s';
	}

	return {
		val: Math.round(value * 10) / 10,
		suffix: suffix
	};
}

function onload() {
	data = JSON.parse(localStorage['data']) || {};
	options = JSON.parse(localStorage['options']) || {};

	chrome.storage.onChanged.addListener(optionsChangedListener);
	optionsChangedListener();	

	window.setInterval(reset, 3000);
	reset();
}

start();