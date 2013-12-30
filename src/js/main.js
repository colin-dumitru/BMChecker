var options = null;

function APIKeySet(){
	return chrome.storage.get(OPT_API_KEY) != null;
}

function start() {
	$(document).ready(onload);
}	

function optionsChangedListener() {

}

function reset() {
	console.log(options);
	if(!options.apikey || !options.apikey.length) {
		$(document.body).append('API key must be set from the options page');		
	} else {
		createPage();
	}
}

function createPage() {


}

function onload() {
	chrome.storage.onChanged.addListener(optionsChangedListener);
	chrome.storage.sync.get('apikey', function(value) {
		options = value;
		reset();
	});
}

start();