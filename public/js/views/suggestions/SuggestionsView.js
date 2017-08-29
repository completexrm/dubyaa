define(['underscore', 'backbone', 'moment', 'jqueryui', 'bootstrap', 'cookie'], function(_, Backbone, moment){

  var SuggestionsView = Backbone.View.extend({
    
    events: {
      'click .mark-read' : 'doMarkRead',
      'click .mark-unread' : 'doMarkUnread',
      'click .mark-delete' : 'doDelete',
      'click .mark-undelete' : 'doUnDelete',
      'click .mark-torch' : 'doTorch',
      'click .mark-backlog' : 'doMarkBacklog',
      'hidden.bs.modal #newSuggestion' : 'setup',
    },

    initialize : function() {
      // kill ajax caching
      $.ajaxSetup({ cache: false });
      var self = this;

      // setup some variables
      this.wsURL = $('body').data('wsurl');
      this.appData = $('#appData'), 
      this.userId = this.appData.attr('data-userid');
      this.accountId = this.appData.attr('data-acctid');

      this.$list = this.$el.find('#list');
      this.$listAccount = this.$el.find('#listAccount');
      this.$listSent = this.$el.find('#listSent');
      
      this.$empty = this.$el.find('#noSuggestions');
      this.$emptyAccount = this.$el.find('#noSuggestionsAccount');
      this.$emptySent = this.$el.find('#noSuggestionsSent');

      this.setup();

    },

    setup : function() {
      var self=this, d = {
        userId: this.userId
      };
      $.get(this.wsURL + '/User/FetchSuggestions?userId=' + this.userId, function(data) {
        if(data.success) {
          self.$empty.addClass('hide');
          var total = data.total;
          $.post('/user/listSuggestions', data.suggestions, function(html) {
            self.$el.find('.suggestions-count').html('(' + total + ')');
            self.$list.html(html).removeClass('hide');
          }, 'html');
        } else {
          self.$el.find('.suggestions-count').addClass('hide');
          self.$list.addClass('hide');
          self.$empty.removeClass('hide');
        }
      }, 'json');
      // $.get(this.wsURL + '/User/FetchSuggestionsSent?userId=' + this.userId, function(data) {
      //   if(data.success) {
      //     self.$emptySent.addClass('hide');
      //     $.post('/user/listSuggestionsSent', data.suggestions, function(html) {
      //       self.$listSent.html(html).removeClass('hide');
      //     }, 'html');
      //   } else {
      //     self.$listSent.addClass('hide');
      //     self.$emptySent.removeClass('hide');
      //   }
      // }, 'json');
      $.get(this.wsURL + '/Account/FetchSuggestions?accountId=' + this.accountId, function(data) {
        if(data.success) {
          self.$emptyAccount.addClass('hide');
          var total = data.total;
          $.post('/user/listSuggestionsAccount', data.suggestions, function(html) {
            self.$el.find('.suggestions-account-count').html('(' + total + ')').removeClass('hide');
            self.$listAccount.html(html).removeClass('hide');
          }, 'html');
        } else {
          self.$el.find('.suggestions-account-count').addClass('hide');
          self.$listAccount.addClass('hide');
          self.$emptyAccount.removeClass('hide');
        }
      }, 'json');
    },

    doMarkRead : function(event) {
      var $e = $(event.currentTarget), id = $e.data('id'), self=this,
      d = {
        id: id,
        userId: this.userId
      };
      $.post(this.wsURL + '/User/ReadSuggestion', d, function(data) {
        if(data.success) {
          $e.addClass('hide').siblings('.mark-unread').removeClass('hide');
          $e.closest('.suggestion').find('.suggestion-label').removeClass('bold');
        } else { 
          // TODO: error handling
        }
      }, 'json');
    },

    doMarkUnread : function(event) {
      var $e = $(event.currentTarget), id = $e.data('id'), self=this,
      d = {
        id: id,
        userId: this.userId
      };
      $.post(this.wsURL + '/User/UnreadSuggestion', d, function(data) {
        if(data.success) {
          $e.addClass('hide').siblings('.mark-read').removeClass('hide');
          $e.closest('.suggestion').find('.suggestion-label').addClass('bold');
        } else { 
          // TODO: error handling
        }
      }, 'json');
    },

    doDelete : function(event) {
      var $e = $(event.currentTarget), id = $e.data('id'), self=this,
      d = {
        id: id,
        userId: this.userId
      };
      $.post(this.wsURL + '/User/DeleteSuggestion', d, function(data) {
        if(data.success) {
          self.setup();
        } else { 
          // TODO: error handling
        }
      }, 'json');
    },

    doUnDelete : function(event) {
      var $e = $(event.currentTarget), id = $e.data('id'), self=this,
      d = {
        id: id,
        userId: this.userId
      };
      $.post(this.wsURL + '/User/UndeleteSuggestion', d, function(data) {
        if(data.success) {
          self.setup();
        } else { 
          // TODO: error handling
        }
      }, 'json');
    },

    doTorch : function(event) {
      var $e = $(event.currentTarget), id = $e.data('id'), self=this,
      d = {
        id: id,
        userId: this.userId
      };
      $.post(this.wsURL + '/User/TorchSuggestion', d, function(data) {
        if(data.success) {
          self.setup();
        } else { 
          // TODO: error handling
        }
      }, 'json');
    },

    doMarkBacklog : function(event) {
      var $e = $(event.currentTarget), id = $e.data('id'), 
      fromId = $e.data('from-id'), hasGift = $e.data('has-gift'), label = $e.data('label'), self=this,
      d = {
        id: id,
        userId: this.userId,
        fromId: fromId,
        accountId: this.accountId,
        hasGift: hasGift,
        label: label
      };
      $.post(this.wsURL + '/Todo/SuggestionToBacklog', d, function(data) {
        if(data.success) {
          self.setup();
        } else { 
          // TODO: error handling
        }
      }, 'json');
    }

  });

  return SuggestionsView;

});