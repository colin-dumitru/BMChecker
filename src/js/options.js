function start() {
	$(document).ready(onload);
}

function loadOptions() {
	var apiKey = chrome.storage.sync.get('apikey', function(value) {
		$("#api_key").val(value.apikey);		
	});
}	

function save() {
	chrome.storage.sync.set({
		'apikey': $("#api_key").val()
	}, function() {
		alert('Saved!');
	});
}

function onload() {
	$("#save_button").click(save);

	loadOptions();
}

start();