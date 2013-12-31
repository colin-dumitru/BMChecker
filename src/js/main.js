var	jq = chrome.extension.getBackgroundPage().$,
 	data = chrome.extension.getBackgroundPage().data,
	options = chrome.extension.getBackgroundPage().options,
	worker_id = 'general',
	worker_update_function = updateGeneralPage;

function start() {
	$(document).ready(onload);
}	

function update() {
	if(!options.apikey || !options.apikey.length) {
		$('#error', document).text('API key must be set from the options page');		
	} else {
		updateWorkerList();
		updateCurrentPage();
		updateWorkerSelection();
	}
}

function updateWorkerList() {
	$('#workers_list', document).children().remove();

	$('#workers_list', document).append('<div id="worker_general" binder="createGeneralPage" worker_id="general">&#x2190;general</div>')

	for (var i in data.workers) {
		var worker = data.workers[i];
		$('#workers_list', document).append('<div id="worker_' + i + '" class="worker_label" binder="createWorkerPage" worker_id="' + i +'">' + worker.name + '</div>')
	}

	$('#workers_list', document).children().click(workerClicked);
}

function workerClicked() {
	var moi = $(this);
	worker_id = moi.attr('worker_id');

	window[moi.attr('binder')]();
	updateCurrentPage();
	updateWorkerSelection();
}

function updateWorkerSelection() {
	$('.worker_label_selected', document).removeClass('worker_label_selected');
	$('#worker_' + worker_id, document).addClass('worker_label_selected');
}

function updateCurrentPage() {
	$('#loading_overlay', document).hide();
	worker_update_function();
}

//--------------------------------------------------------------------------

function updateGeneralPage() {
	var rate = convertHashRate(parseFloat(data.hash_rate));

	$('#username', document).text(data.name);

	//todo cache these
	$("#hash_rate", document).text(rate.val);
	$("#hash_rate_suffix", document).text(rate.suffix);

	$("#accepted", document).text(data.shift.accepted);
	$("#rejected", document).text(data.shift.rejected);
	$("#user_score", document).text(parseFloat(data.shift.user_score).toFixed(10));
	$("#total_score", document).text(parseFloat(data.shift.total_score).toFixed(10));

	$("#btc", document).text(parseFloat(data.balances.BTC).toFixed(10));
	$("#nmc", document).text(parseFloat(data.balances.NMC).toFixed(10));
}

function createGeneralPage() {
	worker_update_function = updateGeneralPage;
	$('#page', document).html(getTemplate('general_page'));
}

//--------------------------------------------------------------------------

function updateWorkerPage() {
	var rate = convertHashRate(parseFloat(data.workers[worker_id].hash_rate));

	$('#username', document).text(data.workers[worker_id].name);

	//todo cache these
	$("#hash_rate", document).text(rate.val);
	$("#hash_rate_suffix", document).text(rate.suffix);

	$("#btc_round_accepted", document).text(data.workers[worker_id].work.BTC.round_accepted);
	$("#btc_round_rejected", document).text(data.workers[worker_id].work.BTC.round_rejected);
	$("#btc_total_accepted", document).text(data.workers[worker_id].work.BTC.total_accepted);
	$("#btc_total_rejected", document).text(data.workers[worker_id].work.BTC.total_rejected);

	$("#nmc_round_accepted", document).text(data.workers[worker_id].work.NMC.round_accepted);
	$("#nmc_round_rejected", document).text(data.workers[worker_id].work.NMC.round_rejected);
	$("#nmc_total_accepted", document).text(data.workers[worker_id].work.NMC.total_accepted);
	$("#nmc_total_rejected", document).text(data.workers[worker_id].work.NMC.total_rejected);	
}

function createWorkerPage() {
	worker_update_function = updateWorkerPage;
	$('#page', document).html(getTemplate('worker_page'));
}

//--------------------------------------------------------------------------

function getTemplate(id) {
	return $("#" + id, document).html();
}

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
	createGeneralPage();
	update();
	bind();
}

function bind() {
	$("#workers_list", document).mouseenter(function() {
		$("#content", document).addClass('workers_list_expanded');
	});

	$("#workers_list", document).mouseleave(function() {
		$("#content", document).removeClass('workers_list_expanded');
	});
}

start();

//--------------------------------------------------------------------------

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-41406389-2']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();