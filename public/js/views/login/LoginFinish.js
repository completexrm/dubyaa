define(['jquery', 'underscore', 'backbone', 'bootstrap'], function($, _, Backbone){
  return Backbone.View.extend({
    events: {
      
    },
    initialize : function() {	
    	setTimeout(function() {
    		window.location = '/';
    	}, '500');
    }
  });
});