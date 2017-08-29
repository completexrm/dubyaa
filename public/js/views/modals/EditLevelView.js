define(['underscore', 'backbone', 'moment', 'jqueryui', 'bootstrap'], function(_, Backbone, moment){

  var EditLevelView = Backbone.View.extend({
    events: {
      'click #doUpdateLevel' : 'doEditLevel',
      'blur .required-missing' : 'doCheckMissing',
      'hidden.bs.modal #editTeam' : 'setupForm'
    },

    initialize : function() {
      
      // kill ajax caching
      $.ajaxSetup({ cache: false });
      var self = this;
      this.wsURL = $('body').data('wsurl');
      this.$modal = this.$el.find('#editLevel');
      // setup some variables
      this.userId = this.$el.attr('data-userid');
      this.acctId = this.$el.attr('data-acctid');
      this.setupForm();
    },

    // User clicks save button
    doEditLevel : function(event) {
      var self=this, $e = $(event.currentTarget);
      this.disableForm($e);
      if(this.validateForm()) {
        d = {
          userId: this.userId,
          id: this.$modal.find('#levelId').val(),
          label: this.$modal.find('#label').val(),
          valueLo: this.$modal.find('#valueLo').val(),
          valueHi: this.$modal.find('#valueHi').val()
        }
        $.post(this.wsURL + '/Account/UpdateLevel', d, function(data) {
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
      this.$modal.find('#loader').removeClass('hide');
      this.$modal.find('input[type="text"]').attr('disabled', 'disabled');
    },

    enableForm : function() {
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

  return EditLevelView;

});