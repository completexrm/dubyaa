define(['underscore', 'backbone', 'moment', 'jqueryui', 'bootstrap', 'cookie'], function(_, Backbone, moment){

  var TagsView = Backbone.View.extend({
    events: {
      
    },

    initialize : function() {
      
      
      $.ajaxSetup({ cache: false });
      var self = this;
      
      this.wsURL = $('body').data('wsurl');
      this.appData = $('#appData'), this.userId = this.appData.attr('data-userid'),
      this.acctId = this.appData.attr('data-acctid');
      this.$tags = this.$el.find('#tags');
      this.setup();

    },

    setup : function() {
      var self=this;
      $.get(this.wsURL + '/Todo/FetchUserPopularTags?userId=' + this.userId, function(data) {
        var d = { tags: data.tags }
        $.post('/todo/listUserPopularTags', d, function(data) {
          self.$el.html(data);
        }, 'html');
      }, 'json');
    }

  });

  return TagsView;

});