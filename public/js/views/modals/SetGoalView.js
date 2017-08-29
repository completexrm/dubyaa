define(['underscore', 'backbone', 'moment', 'jqueryui', 'bootstrap'], function(_, Backbone, moment){

  var SetGoalView = Backbone.View.extend({
    events: {
      'click .save-goal' : 'doSaveGoal',
      'change #avgPointsDay' : 'doSetupPoints'
    },

    initialize : function() {
      
      // kill ajax caching
      $.ajaxSetup({ cache: false });
      var self = this;
      this.wsURL = $('body').data('wsurl');
      this.$modal = this.$el.find('#manageGoals');

      // setup some variables
      this.userId = this.$el.attr('data-userid'),
      this.$ptsAvg = this.$el.find('#avgPointsDay'),
      this.$gY = this.$el.find('#goalsYear'),
      this.$gQ = this.$el.find('#goalsQuarter'),
      this.$gM = this.$el.find('#goalsMonth');
      this.$avgPointsDay = this.$el.find('#avgPointsDay');
      this.doSetupPoints();

      $('body').on('click', '.manage-goals', function(event) {
        self.doEditGoals(event);
      });
      
    },

    doEditGoals : function(event) {
      this.$modal.modal('show');
      this.$avgPointsDay.focus().select();
    },

    doSaveGoal : function(event) {
      var self=this, $e = $(event.currentTarget), goalType = $e.data('goal-type'),
      parentId = $e.data('goal-parent'),
      $parent = this.$el.find('#' + parentId),
      pts = $parent.find('.goal-slide-tag').val(),
      d = {
        userId: this.userId,
        avgPointsDay: this.$ptsAvg.val(),
        Y: this.$gY.find('.calc-pts').text(),
        Q: this.$gQ.find('.calc-pts').text(),
        M: this.$gM.find('.calc-pts').text()
      };
      $.post(this.wsURL + '/User/SetGoal', d, function(data) {
        $.post('/user/saveGoal', d).always(function () {
          self.$el.find('.modal').modal('hide');
        });
      }, 'json');
    },

    doSetupPoints : function() {
      var avg = this.$ptsAvg.val(), 
      gY = Math.floor(avg * 365),
      gQ = Math.floor(avg * 90),
      gM = Math.floor(avg * 30);
      this.$gY.find('.calc-pts').text(gY);
      this.$gQ.find('.calc-pts').text(gQ);
      this.$gM.find('.calc-pts').text(gM);
    }

  });

  return SetGoalView;

});