define(['underscore', 'backbone', 'moment', 'jqueryui', 'bootstrap', 'cookie'], function(_, Backbone, moment){

  var StatsView = Backbone.View.extend({
    
    events: {
      
    },

    initialize : function() {
      // kill ajax caching
      $.ajaxSetup({ cache: false });
      var self = this;

      // setup some variables
      this.wsURL = $('body').data('wsurl');
      this.appData = $('#appData'), 
      this.userId = this.appData.attr('data-userid');
      this.acctId = this.appData.attr('data-acctid');
    
      $('.leaderboard-tag').text(moment().format('MMMM')); 
      this.setup();

    },

    sizeGauges : function() {
      this.$el.find('.goal-gauge').each(function() {
        var w = $(this).parent().outerWidth(true);
        $(this).css({
          'width': parseInt(w, 10) + 'px'
        });
      });
    },

    setup : function(event) {
      var self = this;
      $.get(this.wsURL + '/Account/FetchMonthList?id=' + this.acctId + '&year=' + this.year, function(data) {
        if(data.success) {
          $.post('/account/monthlist', data.months, function(html) {
            self.$accountMonthList.html(html);
          });
        }
      }, 'json');
      // this.sizeGauges();
      // $.get(this.wsURL + '/Report/UserPoints?userId='+this.userId, function(data) {
      //   var points = data.points;
      //   // self.sizeGauges();
      //   // setTimeout(function() {
      //   //   var gaugeMonth = new JustGage({
      //   //     id: "pointsMonth",
      //   //     value: points.month.percent,
      //   //     min: 0,
      //   //     max: 100,
      //   //     title: moment().format('MMMM') + ' (' + points.month.pts + ' / ' + points.month.goal + ')'
      //   //   });
      //   //   var gaugeQuarter = new JustGage({
      //   //     id: "pointsQuarter",
      //   //     value: points.quarter.percent,
      //   //     min: 0,
      //   //     max: 100,
      //   //     title: 'Q' + moment().quarter() + ' ' + moment().format('YYYY') + ' (' + points.quarter.pts + ' / ' + points.quarter.goal + ')'
      //   //   });
      //   //   var gaugeYear = new JustGage({
      //   //     id: "pointsYear",
      //   //     value: points.year.percent,
      //   //     min: 0,
      //   //     max: 100,
      //   //     title: moment().format('YYYY') + ' (' + points.year.pts + ' / ' + points.year.goal + ')'
      //   //   });
      //   // }, 100)
      //   $.get(self.wsURL + '/Report/UserSocial?userId='+self.userId, function(data) {
      //     self.$el.find('#socialPositive .number').text(data.social.totalGood);
      //     self.$el.find('#socialNegative .number').text(data.social.totalBad);
      //     self.$el.find('#socialDispute .number').text(data.social.totalDispute);
      //     self.$el.find('#socialPositiveGiven .number').text(data.social.totalGoodGiven);
      //     self.$el.find('#socialNegativeGiven .number').text(data.social.totalBadGiven);
      //     self.$el.find('#socialDisputeGiven .number').text(data.social.totalDisputeGiven);
      //   });
      // }, 'json');
    },

  });

  return StatsView;

});