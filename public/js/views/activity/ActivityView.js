define(['underscore', 'backbone', 'moment', 'jqueryui', 'bootstrap', 'cookie'], function(_, Backbone, moment){

  var ActivityView = Backbone.View.extend({
    events: {
      'click .do-react' : 'doReact',
      'click .kill-reaction' : 'doReactDelete',
      'click .activity-item' : 'doShowReactions',
      'click .cancel-react' : 'doHideReactions',
      'click .do-prod' : 'doProd',
      'click #activityMore' : 'loadMore',
      'click .only-wins' : 'doLoadWins',
      'click .show-all' : 'doLoadAll'
    },

    initialize : function() {

      // kill ajax caching
      $.ajaxSetup({ cache: false });
      var self = this;
      
      // setup some variables
      this.wsURL = $('body').data('wsurl');
      this.appData = $('#appData'), this.userId = this.appData.attr('data-userid'),
      this.displayName = this.appData.attr('data-display-name'),
      this.userEmail = this.appData.attr('data-email'),
      this.acctId = this.appData.attr('data-acctid'),
      this.isMobile = this.appData.attr('data-is-mobile');
      this.$list = this.$el.find('#list');
      this.$activityList = this.$el.find('#activityList');
      this.$prodList = this.$el.find('#benchList');

      this.$moreBtn = this.$el.find('#activityMore a');
      this.$empty = this.$el.find('#noActivity');

      this.messagesStart = '0';
      this.messagesLimit = '10';

      this.setup();
      
      if(Number(this.isMobile)===0) {
        // poll activity section
        window.setInterval(function() {
          self.setup();
        }, 30000);
      }

    },

    setup : function() {
      this.fetchList(this.messagesStart, this.messagesLimit, true);
      this.doShowProdList();
    },

    doLoadWins : function(event) {
      this.$el.find('#showAllContainer').removeClass('hide');
      this.$el.find('#showWinsContainer').addClass('hide');
      this.$moreBtn.attr('data-only-wins', true);
      this.fetchList(this.messagesStart, this.messagesLimit, true);
    },

    doLoadAll : function(event) {
      this.$el.find('#showAllContainer').addClass('hide');
      this.$el.find('#showWinsContainer').removeClass('hide');
      this.$moreBtn.attr('data-only-wins', false);
      this.fetchList(this.messagesStart, this.messagesLimit, true);
    },

    loadMore : function() {
      var currentStart = this.$moreBtn.attr('data-current-start');
      var start = parseInt(currentStart) + parseInt(this.messagesLimit);
      this.fetchList(start, this.messagesLimit, false);
    },

    fetchList : function(start, limit, isFirst) {
      var self=this, onlyWins = (this.$moreBtn.attr('data-only-wins')==='true') ? 1 : 1;
      $.get(this.wsURL + '/Account/FetchTodoActivity?u=' + this.userId + '&a=' + this.acctId + '&start=' + start + '&limit=' + limit + '&onlyWins=' + onlyWins, function(data) {
        if(data.success===true) {
          if((parseInt(start) + parseInt(self.messagesLimit)) >= data.totalActivity) {
            removeButtonClass='block';
            addButtonClass='hide';
          } else {
            removeButtonClass='hide';
            addButtonClass='block';
          }
          $.post('/account/activity', data.activity, function(html) {
            self.$moreBtn.attr('data-current-start', start);
            if(isFirst===true) {
              console.log('initial load');
              self.$list.html(html);
              self.$moreBtn.removeClass('hide');
            } else {
              console.log('appending');
              self.$list.append(html);
            }
            self.$moreBtn.addClass(addButtonClass).removeClass(removeButtonClass);
          });
        } else {
          if(isFirst===true) {
            self.$empty.removeClass('hide');
          } else {
            self.$moreBtn.addClass('hide');
          }
        }
      }, 'json').fail(function() {
        self.$list.html('No activity yet today');
      });
    },

    doShowReactions : function(event) {
      var $e = $(event.currentTarget);
      this.$el.find('.activity-elements').addClass('hide');
      $e.find('.activity-elements').removeClass('hide');
    },

    doHideReactions : function(event) {
      event.stopPropagation();
      var $e = $(event.currentTarget);
      $e.closest('.activity-elements').addClass('hide blargon');
    },

    doReact : function(event) {
      var self=this,
      $e = $(event.currentTarget), actionId = $e.data('action-id'),
      activityId = $e.data('activity-id'), toId = $e.data('to-id'), 
      isGood=0, isBad=0, isDispute=0, emailEndpoint;

      if($e.data('react')==='good') {
        isGood = 1, emailEndpoint = 'Kudos';
      } else if($e.data('react')==='dispute') {
        isDispute = 1; emailEndpoint = 'Dispute';
      } else {
        isBad=1; emailEndpoint = 'Boo';
      }

      var d = {
        toId: $e.data('to-id'), 
        accountId: this.acctId,
        actionId: $e.data('action-id'), 
        fromId: this.userId,
        activityId: $e.data('activity-id'),
        isGood: isGood,
        isBad: isBad,
        isDispute: isDispute
      };
      $.post(this.wsURL + '/Todo/React', d, function(data) {
        self.setup();
      });
      var dEmail = {
        toId: $e.data('to-id'),
        displayName: $e.data('who-reacted'),
        todoName: $e.data('todo'),
        whoReacted: this.displayName,
      };
      
      $.post(this.wsURL + '/Email/Todo' + emailEndpoint, dEmail);

    },

    doReactDelete : function(event) {
      var self=this, $e=$(event.currentTarget), id = $e.data('id'),
      todoId = $e.data('todo-id');
      d = {
        id: id,
        accountId: this.acctId,
        userId: this.userId,
        todoId: todoId
      };
      $.post(this.wsURL + '/Todo/ReactDelete', d, function(data) {
        self.setup();
      });
    },

    doShowProdList : function(event) {
      var self=this;
      // this.$activityList.parent().toggleClass('hide');
      // this.$prodList.toggleClass('hide');
      var today = moment();
      var tomorrow = today.subtract(1, 'days');
      var date = moment(tomorrow).format("YYYY-MM-DD"); 
      // var date = ''; 
      $.get(this.wsURL + '/Account/FetchUsers?accountId=' + this.acctId + '&userId=' + this.userId + '&date=' + date, function(data) {
        if(data.success) {
          $.post('/activity/prodList', data.users, function(html) {
            self.$prodList.find('#noBench').addClass('hide');
            self.$prodList.find('#prod').removeClass('hide');
            self.$prodList.attr('data-is-loaded', 'true');
            self.$prodList.find('#prod').html(html);
          }, 'html');
        } else {
          self.$prodList.find('#noBench').removeClass('hide');
          self.$prodList.find('#prod').addClass('hide');
        }
      });
    },

    doProd : function(event) {
      var self=this, $e = $(event.currentTarget), userId = $e.data('id'), email = $e.data('email'),
      $loading = $e.prev('.prod-loading');
      $e.addClass('hide');
      $loading.removeClass('hide');
      
      var d = {
        id: this.userId,
        userId: userId,
        emailAddress: email,
        displayName: this.displayName
      };
      
      $.post(this.wsURL + '/Email/Prod', d);
      $e.removeClass('hide');
      $loading.addClass('hide');
      alert('Your prod has been sent!');
    }

  });

  return ActivityView;

});