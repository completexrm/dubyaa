define(['underscore', 'backbone', 'moment', 'jqueryui', 'bootstrap', 'cookie'], function(_, Backbone, moment){

  var MessagesView = Backbone.View.extend({
    
    events: {
      'click #post' : 'doNewMessage',
      'click #messagesMore' : 'loadMore',
      'click .delete-message' : 'doDeleteMessage',
      'click .message-comment' : 'doMessageComment',
      'click .message-respond' : 'doShowReplyBox',
      'click .do-cancel' : 'doHideReplyBox',
      'click .do-reply' : 'doReply'
    },

    initialize : function() {
      // kill ajax caching
      $.ajaxSetup({ cache: false });
      var self = this;

      // setup some variables
      this.wsURL = $('body').data('wsurl');
      this.appData = this.$el.find('#appData'), 
      this.userId = this.appData.attr('data-userid'), 
      this.accountId = this.appData.attr('data-acctid'), 

      this.historyStart = '0';
      this.historyLimit = '10';

      this.$list = this.$el.find('#messagesList');
      this.$moreBtn = this.$el.find('#messagesMore a');
      this.$loader = this.$el.find('#loader');
      this.$empty = this.$el.find('#noMessages');
      
      this.setup(true);

    },

    setup : function() {
      this.fetchList(this.historyStart, this.historyLimit, true);
    },

    loadMore : function() {
      var currentStart = this.$moreBtn.attr('data-current-start');
      var start = parseInt(currentStart) + parseInt(this.historyLimit);
      this.fetchList(start, this.historyLimit, false);
    },

    fetchList : function(start, limit, isFirst) {
      var self=this;
      $.get(this.wsURL + '/Message/All?userId=' + this.userId + '&accountId=' + this.accountId + '&start=' + start + '&limit=' + limit, function(data) {
        if(data.success===true) {
          self.$empty.addClass('hide');
          self.$loader.addClass('hide');
          var removeButtonClass = '', addButtonClass='';
          if((parseInt(start) + parseInt(self.historyLimit)) >= data.totalMessages) {
            removeButtonClass='block';
            addButtonClass='hide';
          } else {
            removeButtonClass='hide';
            addButtonClass='block';
          }
          $.post('/messages/list', data.messages, function(list) {
            self.$moreBtn.attr('data-current-start', start);
            if(isFirst===true) {
              self.$list.html(list);
            } else {
              self.$list.append(list);
            }
            self.$moreBtn.addClass(addButtonClass).removeClass(removeButtonClass);
          });
        } else {
          self.$empty.removeClass('hide');
          self.$loader.addClass('hide');
          self.$list.html('');
        }
      }, 'json');
    },

    doNewMessage : function(event) {
      var self=this, $e = $(event.currentTarget);
      var message = this.$el.find('#new').val(),
      d = {
        userId: this.userId,
        accountId: this.accountId,
        message: message
      };
      if(message==='') {
        alert('Nothing to post!');
        this.$el.find('#new').focus();
        return;
      }
      $.post(this.wsURL + '/Message/Post', d, function(data) {
        self.setup();
        self.$el.find('#new').val('');
      }, 'json');
    },

    doDeleteMessage : function(event) {
      var self=this, $e = $(event.currentTarget);
      var id = $e.data('id');
      d = {
        userId: this.userId,
        id: id
      };
      $.post(this.wsURL + '/Message/Delete', d, function(data) {
        self.setup();
      }, 'json');
    },

    doShowReplyBox : function(event) {
      var self=this, $e=$(event.currentTarget), msgId = $e.attr('data-id'),
      $tools = $e.closest('.message-tools-container'),
      $reply = $tools.prev('.message-respond-container');
      
      $tools.addClass('hide');
      $reply.removeClass('hide').find('.response').focus();

    },

    doHideReplyBox : function(event) {
      var self=this, $e=$(event.currentTarget);
      $e.closest('.message-respond-container')
        .addClass('hide')
          .next('.message-tools-container')
          .removeClass('hide');
    },

    doReply : function(event) {
      var $e = $(event.currentTarget), msgId = $e.attr('data-id'), 
      $message = $e.closest('.message-respond-container').find('textarea.response'), 
      self=this, 
      d = {
        userId: this.userId,
        accountId: this.accountId,
        message: $message.val(),
        parentId: msgId
      };
      $.post(this.wsURL + '/Message/Post', d, function(data) {
        self.setup();
      }, 'json');
      console.log(d);
    }

  });

  return MessagesView;

});