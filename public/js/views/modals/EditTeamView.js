define(['underscore', 'backbone', 'moment', 'jqueryui', 'bootstrap'], function(_, Backbone, moment){

  var EditTeamView = Backbone.View.extend({
    events: {
      'click #doUpdateTeam' : 'doEditTeam',
      'blur .required-missing' : 'doCheckMissing',
      'hidden.bs.modal #editTeam' : 'setupForm'
    },

    initialize : function() {
      
      // kill ajax caching
      $.ajaxSetup({ cache: false });
      var self = this;
      this.wsURL = $('body').data('wsurl');
      this.$modal = this.$el.find('#editTeam');
      // setup some variables
      this.userId = this.$el.attr('data-userid');
      this.acctId = this.$el.attr('data-acctid');
      this.setupForm();
    },

    // User clicks save button
    doEditTeam : function(event) {
      var self=this, $e = $(event.currentTarget);
      this.disableForm($e);
      if(this.validateForm()) {
        d = {
          userId: this.userId,
          teamId: this.$modal.find('#teamId').val(),
          displayName: this.$modal.find('#displayName').val()
        }
        $.post(this.wsURL + '/Team/Update', d, function(data) {
          if(data.success===true) {
            self.$modal.modal('hide');
          }
        }, 'json');
      } else {
        this.enableForm($e);
        this.$modal.find('input.required-missing').first().focus();
      }
    },

    // Ensure form is baselined on load
    setupForm : function() {
      this.$modal.find('.form-element').each(function() {
        $(this).val('').removeAttr('checked');
      });
      this.enableForm();
    },

    // Disable form elements while we try to save
    disableForm : function() {
      this.$modal.find('#doNewTeam').addClass('hide');
      this.$modal.find('#loader').removeClass('hide');
      this.$modal.find('input[type="text"]').attr('disabled', 'disabled');
    },

    enableForm : function() {
      this.$modal.find('#doNewTeam').removeClass('hide');
      this.$modal.find('#loader').addClass('hide');
      this.$modal.find('input').removeAttr('disabled');
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
    }

  });

  return EditTeamView;

});