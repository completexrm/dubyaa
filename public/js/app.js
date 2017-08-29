// Filename: app.js
define(['jquery', 'underscore', 'backbone', 'moment', 'router'], function($, _, Backbone, moment, Router){
	
	var initialize = function(){
		Router.initialize();
	};
	return { 
		initialize: initialize
	};
});