define(['underscore', 'backbone', 'moment', 'jqueryui', 'bootstrap', 'cookie'], function(_, Backbone, moment){

  var ScoreView = Backbone.View.extend({
    
    events: {
      'click .select-month' : 'doSelectMonth'
    },

    initialize : function() {
      $.ajaxSetup({ cache: false });
      var self = this;
      this.wsURL = $('body').data('wsurl');
      this.appData = $('#appData'), 
      this.userId = this.appData.attr('data-userid'), 
      this.acctId = this.appData.attr('data-acctid');
      this.month = moment().format('MM');
      this.year = moment().format('YYYY');
      this.gauge = this.$el.find('#productivity');
      this.accountGauge = this.$el.find('#accountProductivity');
      this.$leaderboard = this.$el.find('#leaderboard');
      this.setupUI();
      this.$accountMonthList = this.$el.find('#accountMonthList');
      this.$empty = this.$el.find('#noLeaderboard');
      this.$loader = this.$el.find('#loader');

      $(window).on('resize', function() {
        self.sizeGauges();
      });
    },

    doSelectMonth : function(event) {
      var $e = $(event.currentTarget), month = $e.data('month'), label = $e.text();
      this.$el.find('.leaderboard-tag').text(label);
      this.month = month;
      this.setupUI();
    },

    sizeGauges : function() {
      var psW = this.gauge.parent().outerWidth(true);
      var apsW = this.accountGauge.parent().outerWidth(true);
      this.gauge.css({
        'width': parseInt(psW, 10) + 'px'
      });
      this.accountGauge.css({
        'width': parseInt(apsW, 10) + 'px'
      });
    },

    setupUI : function() {
      var self=this;
      $.get(this.wsURL + '/Report/AccountLeaderboard?accountId=' + this.acctId + '&month='+this.month+'&year='+this.year, function(data) {
        if(data.success) {
          $.post('/stats/leaderboard', data.leaderboard, function(html) {
            self.$leaderboard.html(html);
          }, 'html');
        } else {
          self.$empty.removeClass('hide');
          self.$loader.addClass('hide');
        }
      }, 'json');
      $.get(this.wsURL + '/Account/FetchMonthList?id=' + this.acctId + '&year=' + this.year, function(data) {
        if(data.success) {
          $.post('/account/monthlist', data.months, function(html) {
            self.$accountMonthList.html(html);
          });
        }
      }, 'json');
    }

  });

  return ScoreView;

});