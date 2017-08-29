define(['underscore', 'backbone', 'moment', 'jqueryui', 'bootstrap', 'cookie'], function(_, Backbone, moment){

  var NewInstawinView = Backbone.View.extend({
    
    events: {
      'click #saveInstawin' : 'doSaveInstawin',
      'shown.bs.modal #newInstawin' : 'focusInstawin'
    },

    initialize : function() {

      // kill ajax caching
      $.ajaxSetup({ cache: false });
      var self = this;
      this.wsURL = $('body').data('wsurl');
      this.$modal = this.$el.find('#newInstawin');
      // setup some variables
      this.appData = $('#appData'), 
      this.userId = this.appData.attr('data-userid');
      this.acctId = this.appData.attr('data-acctid');
    },

    focusInstawin : function() {
      this.$modal.find('textarea#instawin').focus();
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

    doSaveInstawin : function(event) {
      var $e = $(event.currentTarget), self=this, label = this.$el.find('#instawin').val(),
      d = {
        label: this.$modal.find('#instawin').val(),
        userId: this.userId,
        accountId: this.acctId
      };
      if(!label) {
        alert('You have to enter something to win it!');
        this.focusInstawin();
        return;
      }
      $.post(this.wsURL + '/Todo/CreateInstawin', d, function(data) {
        if(!data.success) {
          alert('Something went sideways...sorry :(')
        }
        self.$modal.modal('hide');
      }, 'json');
    }

  });

  return NewInstawinView;

});