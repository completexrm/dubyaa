define(['underscore', 'backbone', 'moment', 'jqueryui', 'bootstrap', 'cookie'], function(_, Backbone, moment){

  var NewIdeaView = Backbone.View.extend({
    
    events: {
      'click #saveIea' : 'doSaveIdea',
      'shown.bs.modal #newIdea' : 'focusIdea'
    },

    initialize : function() {
      // kill ajax caching
      $.ajaxSetup({ cache: false });
      var self = this;
      this.wsURL = $('body').data('wsurl');
      this.$modal = this.$el.find('#newIdea');
      // setup some variables
      this.appData = $('#appData'), 
      this.userId = this.appData.attr('data-userid');
      this.acctId = this.appData.attr('data-acctid');
    },

    focusSuggestion : function() {
      this.$modal.find('#idea').focus();
    },

    validateForm : function() {
      var err=0;
      this.$modal.find('.required').each(function() {
        var $e = $(this), v = $e.val();
        if(!v) {
          $e.addClass('required-missing');
          err++;
        } else {
          $e.removeClass('required-missing');
        }
      });
      if(err===0) {
        return true;
      } else {
        return false;
      }
    },

    doCheckMissing : function(event) {
      var $e = $(event.currentTarget), v = $e.val();
      if(v!=='') {
        $e.removeClass('required-missing');
      }
    },

    doSaveIdea : function(event) {
      var $e = $(event.currentTarget), self=this,
      d = {
        idea: this.$modal.find('#idea').val(),
        userId: this.userId
      };
      $.post(this.wsURL + '/Idea/Create', d, function(data) {
        if(!data.success) {
          alert('Something went sideways...sorry :(')
        }
        self.$modal.modal('hide');
      }, 'json');
    }

  });

  return NewIdeaView;

});