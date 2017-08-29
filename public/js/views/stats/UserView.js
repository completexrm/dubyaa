define(['underscore', 'backbone', 'moment', 'jqueryui', 'bootstrap', 'cookie'], function(_, Backbone, moment){

  var UserView = Backbone.View.extend({
    
    events: {
      'click #historyMore' : 'loadMoreHistory',
      'click .select-month' : 'doSelectMonth'
    },

    initialize : function() {
      // kill ajax caching
      $.ajaxSetup({ cache: false });
      var self = this;

      // setup some variables
      this.wsURL = $('body').data('wsurl');
      this.appData = $('#appData'), 
      this.userId = this.appData.attr('data-userid');
      this.statsUserId = this.appData.attr('data-stats-user-id');
      this.month = moment().format('MM');
      this.year = moment().format('YYYY');
      
      this.$list = this.$el.find('#historyList');
      this.$moreBtn = this.$el.find('#historyMore a');
      this.$loader = this.$el.find('#loader');
      this.$historyLoader = this.$el.find('#historyLoader');
      this.$empty = this.$el.find('#noHistory');
      this.$monthList = this.$el.find('#monthList');

      this.historyStart = '0';
      this.historyLimit = '10';

      this.$el.find('.user-stats-month').text(moment().format('MMMM'));
      self.setup();

    },

    doSelectMonth : function(event) {
      var $e = $(event.currentTarget), month = $e.data('month'), label = $e.text();
      this.$el.find('.user-stats-month').text(label);
      this.month = month;
      this.setup();
    },

    setup : function() {
      var self=this;
      $.get(this.wsURL + '/User/FetchProfile?id=' + this.statsUserId, function(data) {
        self.$el.find('.user-stats-display').text(data.profile.displayName);
      }, 'json');
      $.get(this.wsURL + '/Report/FetchUserStats?userId=' + this.statsUserId + '&month=' + this.month + '&year=' + this.year, function(data) {
        if(data.success) {
          var chartDataLabels = [];
          var userData = [];
          var userDataCreated = [];
          var x = 0;
          $.each(data.stats.wins, function(i, v) {
            if(Number(x)===9) {
              x=0;
              chartDataLabels.push(moment(i).format('Do'));
            } else {
              chartDataLabels.push('');
              x++;
            }
            userData.push(parseInt(v, 10));
          });
          $.each(data.stats.created, function(i, v) {
            userDataCreated.push(parseInt(v, 10));
          });
          var chartData = {
            labels: chartDataLabels,
            datasets : [
              {
                fillColor : "rgba(63,195,128,0.2)", strokeColor : "rgba(63,195,128,1)", data : userData, datasetFill: false
              },
              {
                fillColor : "rgba(63,131,215,0.2)", strokeColor : "rgba(63,131,215,1)", data: userDataCreated
              }
            ]
          }
          self.drawChart(chartData);
          self.historySetup();
          self.$loader.addClass('hide');
          self.$el.find('#userActivityCreated').html(data.stats.totalCreated);
          self.$el.find('#userActivityWins').html(data.stats.totalWins);
        }
      }, 'json');
      $.get(this.wsURL + '/User/FetchMonthList?id=' + this.userId + '&year=' + this.year, function(data) {
        if(data.success) {
          $.post('/user/monthlist', data.months, function(html) {
            self.$monthList.html(html);
          });
        }
      }, 'json');
    },

    drawChart : function(ChartData) {
      this.$el.find('#userCanvas').removeClass('hide')
      var ctx = document.getElementById('userCanvas').getContext('2d');
      window.myLine = new Chart(ctx).Line(ChartData, {
        responsive: true,
        pointDot: false,
        scaleShowGridLines: false,

        datasetStrokeWidth: 3
      });
    },

    historySetup : function() {
      this.fetchHistoryList(this.historyStart, this.historyLimit, true);
    },

    loadMoreHistory : function() {
      var currentStart = this.$moreBtn.attr('data-current-start');
      var start = parseInt(currentStart) + parseInt(this.historyLimit);
      this.fetchHistoryList(start, this.historyLimit, false);
    },

    fetchHistoryList : function(start, limit, isFirst) {
      var self=this;
      $.get(this.wsURL + '/User/FetchAllHistory?id=' + this.statsUserId + '&month=' + this.month + '&year=' + this.year + '&start=' + start + '&limit=' + limit, function(data) {
        if(data.success===true) {
          self.$empty.addClass('hide');
          self.$historyLoader.addClass('hide');
          var removeButtonClass='', addButtonClass = '';
          if((parseInt(start) + parseInt(self.historyLimit)) >= data.totalHistory) {
            removeButtonClass='block';
            addButtonClass='hide';
          } else {
            removeButtonClass='hide';
            addButtonClass='block';
          }
          $.post('/stats/showHistory', data.history, function(list) {
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
          self.$historyLoader.addClass('hide');
          self.$list.html('');
        }
      }, 'json');
    }

  });

  return UserView;

});