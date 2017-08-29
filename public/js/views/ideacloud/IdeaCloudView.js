define(['underscore', 'backbone', 'moment', 'jqueryui', 'bootstrap', 'cookie'], function(_, Backbone, moment){

  var IdeaCloudView = Backbone.View.extend({
    
    events: {
      
    },

    initialize : function() {
      // kill ajax caching
      $.ajaxSetup({ cache: false });
      var self = this;
      // setup some variables
      this.wsURL = $('body').data('wsurl');
      this.appData = this.$el.find('#appData'), 
      this.$loader = this.$el.find('#loader'), 
      this.userId = this.appData.attr('data-userid'), 
      this.acctId = this.appData.attr('data-acctid'),

      this.setup();
    
    },

    setup : function() {
      
    }

  });

  return IdeaCloudView;

});