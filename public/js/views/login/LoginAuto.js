define(['jquery', 'underscore', 'backbone', 'bootstrap'], function($, _, Backbone){
  return Backbone.View.extend({
    events: {
      
    },
    initialize : function() {	
		this.appData = this.$el.find('#appData');
		this.key = this.appData.data('key');
		this.email = this.appData.data('email');
		this.wsURL = $('body').data('wsurl');
		var self=this;
		var d = {
			emailAddress: this.email,
			key: this.key
		};
		$.post(this.wsURL + '/Authenticate/Auto', d, function(data) {
	        var d = {
	          user: data.user,
	          prefs: data.prefs,
	          account: data.account
	        };
	        $.post('/login/session', d, function(data) {;
	          window.location = '/login/finish';
	        }, 'json');
	      }, 'json').fail(function() {
	        alert('Check your email / password, and try again.');
	      });
    }
  });
});