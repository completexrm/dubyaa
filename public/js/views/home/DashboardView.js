define(['underscore', 'backbone', 'moment', 'jqueryui', 'bootstrap', 'cookie', 'timepicker'], function(_, Backbone, moment){

  var DashboardView = Backbone.View.extend({
    events: {
      
    },

    initialize : function() {
      // kill ajax caching
      $.ajaxSetup({ cache: false });
      var self = this;
      // setup some variables
      this.wsURL = $('body').data('wsurl');
    }


  });

  return DashboardView;

});