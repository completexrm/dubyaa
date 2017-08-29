define(['underscore', 'backbone', 'moment', 'jqueryui', 'bootstrap'], function(_, Backbone, moment){

  var CommonView = Backbone.View.extend({
    events: {
      'click .help-close' : 'doCloseHelp'
    },

    initialize : function() {
      // kill ajax caching
      $.ajaxSetup({ cache: false });
      var self = this;
      this.wsURL = $('body').attr('data-wsurl');
      // setup some variables
      this.appData = $('#appData'), this.userId = this.appData.attr('data-userid'), 
      this.accountId = this.appData.attr('data-acctid');
      this.$el.find('[data-toggle="tooltip"]').tooltip();

      self.checkCounts();
      window.setInterval(function() {
        self.checkCounts();
      }, 15000);

    },

    checkCounts : function() {
      this.checkSuggestionCount();
      this.checkMessagesRead();
    },

    checkEmailAddress : function(email) {
      // Need a global function to check validity and availability of email address
    },

    checkSuggestionCount : function() {
      var self=this;
      $.get(this.wsURL + '/User/FetchSuggestionCount?userId=' + this.userId  + '&accountId=' + this.accountId, function(data) {
        if(data.count > 0) {
          $('#suggestionCount').text(data.count).removeClass('hide');
        } else {
          $('#suggestionCount').addClass('hide');
        }
      }, 'json');
    },

    checkMessagesRead : function() {
      var self=this;
      $.get(this.wsURL + '/User/FetchMessagesUnread?userId=' + this.userId + '&accountId=' + this.accountId, function(data) {
        if(data.count > 0) {
          $('#unreadMessages').text(data.count).removeClass('hide');
        } else {
          $('#unreadMessages').addClass('hide');
        }
      }, 'json');
    },

    doCloseHelp : function(event) {
      var $e = $(event.currentTarget), $help = $e.closest('.help'), self=this;
      $help.slideUp('fast', function() {
        if($help.find('.hide-all').prop('checked')===true) {
          var d = {
            userId: self.userId
          };
          $.post(self.wsURL + '/User/NoAppHints', d, function() {
            $.post('/user/noAppHints', d);
          });
          alert('You can turn the help & tips back on in your Profile');
        }
      });
    }


  });

  return CommonView;

});