define(['underscore', 'backbone', 'moment', 'jqueryui', 'bootstrap'], function(_, Backbone, moment){

  var EditUserView = Backbone.View.extend({
    events: {
      'click #doEditUser' : 'doEditUser',
      'blur .required-missing' : 'doCheckMissing',
      'change #isAccountAdmin' : 'doCheckAdmin',
      'hidden.bs.modal #editUser' : 'setupForm'
    },

    initialize : function() {
      
      // kill ajax caching
      $.ajaxSetup({ cache: false });
      var self = this;
      this.wsURL = $('body').data('wsurl');
      this.$modal = this.$el.find('#editUser');
      // setup some variables
      this.userId = this.$el.attr('data-userid');
      this.acctId = this.$el.attr('data-acctid');
      this.setupForm();
    },

    // User clicks save button
    doEditUser : function(event) {
      var self=this, $e = $(event.currentTarget);
      this.disableForm($e);
      if(this.validateForm()) {
        d = {
          userId: this.userId,
          id: this.$modal.find('#userId').val(),
          firstName: this.$modal.find('#firstName').val(),
          lastName: this.$modal.find('#lastName').val(),
          emailAddress: this.$modal.find('#emailAddress').val(),
          displayName: this.$modal.find('#displayName').val(),
          isAccountAdmin: this.$modal.find('#isAccountAdmin:checked').length,
        }
        $.post(this.wsURL + '/User/Update', d, function(data) {
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
      this.$modal.find('#adminNote').addClass('hide');
      this.enableForm();
    },

    // Disable form elements while we try to save
    disableForm : function() {
      this.$modal.find('#doNewUser').addClass('hide');
      this.$modal.find('#loader').removeClass('hide');
      this.$modal.find('input[type="text"]').attr('disabled', 'disabled');
    },

    enableForm : function() {
      this.$modal.find('#doNewUser').removeClass('hide');
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
    },

    doCheckAdmin : function(event) {
      var $e = $(event.currentTarget);
      if($e.prop('checked')===true) {
        this.$el.find('#adminNote').removeClass('hide');
      } else {
        this.$el.find('#adminNote').addClass('hide');
      }
    }

  });

  return EditUserView;

});