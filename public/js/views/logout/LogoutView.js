define(['jquery', 'underscore', 'backbone', 'bootstrap', 'cookie'], function($, _, Backbone){
  	
  	return Backbone.View.extend({
    	
    	events: {
    	},
    	
    	initialize : function() {
      		var self=this;
      		this.wsURL = $('body').data('wsurl');
      		this.appData = this.$el.find('#appData'), this.si = this.appData.attr('data-si');
      		this.killDBSession();
    	},

    	killDBSession : function() {
    		var d = { si: this.si };
        $.removeCookie('dubyaaKeepLoginU');
        $.removeCookie('dubyaaKeepLoginH');
        $.post(this.wsURL + '/Authenticate/KillSession', d )
    			.always(function() {
    				window.location.href = '/';
    			});
    	}

	});

});