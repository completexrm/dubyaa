define(['underscore', 'backbone', 'moment', 'jqueryui', 'bootstrap', 'cookie'], function(_, Backbone, moment){

  var RightView = Backbone.View.extend({
    events: {
      'click .react' : 'doReact',
      'click .kill-reaction' : 'doReactDelete'
    },

    initialize : function() {

      // kill ajax caching
      $.ajaxSetup({ cache: false });
      var self = this;
      
      $(window).on('resize', function() {
        self.setupUi(1);
      });

      // setup some variables
      this.wsURL = $('body').data('wsurl');
      this.appData = $('#appData'), this.userId = this.appData.attr('data-userid'),
      this.userDisplayName = this.appData.attr('data-first-name') + ' ' + this.appData.attr('data-last-name'),
      this.userEmail = this.appData.attr('data-email'),
      this.acctId = this.appData.attr('data-acctid');
      this.$list = this.$el.find('#list');
      this.setupUi(0);
      this.setup();
      // poll activity section every minute
      window.setInterval(function() {
        self.setup();
      }, 30000);

    },

    setupUi : function(resize) {
      var $activity = $('#activity');
      var wH = $(window).height();
      var headerH = $('#header').outerHeight(true);
      var headerActivity = $('#headerActivity').outerHeight(true);
      var offsetT = $activity.offset().top;
      var activityHeight = parseInt(wH - offsetT + 1);
      $activity.css({
        height: activityHeight + 'px',
        'overflow-y': 'auto'
      });
    },

    setup : function() {
      var self=this;
      $.get(this.wsURL + '/Account/FetchTodoActivity?u=' + this.userId + '&a=' + this.acctId + '&p=today', function(data) {
        if(data.success===true) {
          $.post('/account/activity', data.activity, function(html) {
            self.$list.html(html);
          });
        } else {
          $.get('/account/noActivity', function(html) {
            self.$list.html(html);
          }, 'html');
        }
      }, 'json').fail(function() {
        self.$list.html('No activity yet today');
      });
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
        whoReacted: this.userDisplayName,
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
    }

  });

  return RightView;

});