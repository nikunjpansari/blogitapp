/* globals  Stamplay,store */
/**
@author Stamplay
@version 2.0
@description an awesome javascript sdk for Stamplay 
*/
/* Initizialize library */
(function (root) {
	
	/*  Inizialization of Stamplay Object */
	root.Stamplay = root.Stamplay || {};
	/* setting attribute API Version */
	root.Stamplay.VERSION = "v1";
	/* appId */
	root.Stamplay.APPID = "";
	/* baseUrl */
	root.Stamplay.BASEURL = "";
	/* options */
	root.Stamplay.OPTIONS = {};
	/*  check if exist local storage with the support of store.js */
	if (window.localStorage && store.enabled) {
		root.Stamplay.USESTORAGE = true;
	}
	if (getURLParameter('jwt')) {
		if (Stamplay.USESTORAGE) {
			store.set(window.location.origin + '-jwt', getURLParameter('jwt'));
		}
	}
	/* init method for setup the base url */ 
	root.Stamplay.init = function (appId, options) {
		root.Stamplay.BASEURL = 'https://' + appId + '.stamplayapp.com';
		root.Stamplay.APPID = appId;
		root.Stamplay.OPTIONS = options || {};
	}

	function getURLParameter(name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
	}

}(this));