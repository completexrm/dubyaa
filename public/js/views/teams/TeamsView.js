define(['underscore', 'backbone', 'moment', 'jqueryui', 'bootstrap', 'cookie'], function(_, Backbone, moment){

  var TeamsView = Backbone.View.extend({
    
    events: {
      'click .view-items' : 'doViewItems',
      'click .hide-items' : 'doHideItems',
      'click .team-roster' : 'doSlideToggleTeam',
      'click .do-suggest' : 'doSetupSuggest'
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
      this.isAdmin = this.appData.attr('data-is-admin');

      this.setup();
    
    },

    setup : function() {
      var self=this, url = 'User/FetchTeamRoster?userId=' + this.userId + '&accountId=' + this.acctId;
      if(Number(this.isAdmin)===1) {
        url = 'Account/FetchTeams?accountId=' + this.acctId;
      }
      $.get(this.wsURL + '/' + url, function(data) {
        self.$loader.remove();
        if(data.success) {
          $.post('/teams/list', data.teams, function(html) {
            self.$el.find('#teamsList').append(html);
          }, 'html');
        } else {
          alert('Something went awry!');
        }
      }, 'json');
    },

    doViewItems : function(event) {
      var self=this, $e = $(event.currentTarget), isLoaded = $e.attr('data-is-loaded'), $user = $e.closest('.user'),
      id = $user.attr('data-id'), $items = $user.find('.items'), $record=$user.find('.record');
      $record.addClass('active');
      $items.removeClass('hide');
      $user.find('.user-history-link').removeClass('hide');
      $e.toggleClass('view-items hide-items');
      $e.find('.arrow').toggleClass('ion-ios-arrow-down ion-ios-arrow-up');
      if(isLoaded==='false') {
        $.get(self.wsURL + '/Todo/UserActive?id=' + id + '&viewingId=' + this.userId, function(data) {
          if(data.success) {
            var d = {
              todos: data.todos
            };
            $.post('/teams/listItems', d, function(html) {
              $items.html(html);
              $e.attr('data-is-loaded', 'true');
            }, 'html');
          } else {
            $items.html('<div class="p10 meta">No activity found</div>');
          }
        }, 'json');
      }
    },

    doHideItems : function(event) {
      var $e = $(event.currentTarget), $user = $e.closest('.user'),
      id = $user.attr('data-id'), $items = $user.find('.items'), $record=$user.find('.record');
      $user.find('.user-history-link').addClass('hide');
      $record.removeClass('active');
      $items.addClass('hide');
      $e.toggleClass('view-items hide-items');
      $e.find('.arrow').toggleClass('ion-ios-arrow-down ion-ios-arrow-up');
    },

    doSlideToggleTeam : function(event) {
      var $e = $(event.currentTarget), $user = $e.next();
      $user.slideToggle('fast');
    },

    doSetupSuggest : function(event) {
      var $modal = $('#modalNewSuggestion');
      var $e = $(event.currentTarget);
      $modal.find('#suggestion').val('');
      $modal.find('#sendSuggestion')
        .attr('data-to-id', $e.attr('data-user-id'));
    }

  });

  return TeamsView;

});