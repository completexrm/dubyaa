define(['underscore', 'backbone', 'moment', 'jqueryui', 'bootstrap'], function(_, Backbone, moment){

  var OnboardView = Backbone.View.extend({
    events: {
      'click #saveOnboard' : 'doSaveOnboard',
      'blur .pw-reset' : 'doCheckPasswordsBlur'
    },

    initialize : function() {
      
      // kill ajax caching
      $.ajaxSetup({ cache: false });
      var self = this;
      this.wsURL = $('body').data('wsurl');
      this.$modal = this.$el.find('#modalOnboard');
      this.$tz = this.$el.find('#onboardTimezone');
      this.$emailAddress = this.$el.find('#emailAddress');
      this.$amRemindTime = this.$el.find('#onboardAMRemindTime');
      this.$pmRemindTime = this.$el.find('#onboardPMRemindTime');
      this.$hasReminders = this.$el.find('#onboardReminders');
      this.$hasRemindersSMS = this.$el.find('#onboardRemindersSMS');
      this.$mobileNumber = this.$el.find('#mobileNumber');
      this.$mobileCarrierSMS = this.$el.find('#mobileCarrierSMS');
      this.$pw = this.$el.find('#pw');
      // setup some variables
      this.userId = this.$el.attr('data-userid');
      this.acctId = this.$el.attr('data-acctid');

      this.$el.find('select').each(function() {
        var $e = $(this),
        $opt = $e.find('option[data-selected="1"]');
        $e.find('option').removeAttr('selected');
        $opt.attr('selected', 'selected');
      });
      
    },

    doCheckPasswordsBlur : function(event) {
      if(!this.doCheckPasswords(event)) {
        alert('Please check your passwords...');
        this.$el.find('#pw').focus();
        return;
      }
    },

    doCheckPasswords : function(event) {
      $p1 = this.$el.find('#pw'),
      $p2 = this.$el.find('#pwConfirm'),
      p1 = $p1.val(),
      p2 = $p2.val();
      if(typeof event !=='undefined') {
        var $e = $(event.currentTarget),
        id = $e.attr('id');
        if(!p1 && id==='pw') {
          return false;
        }
        if(!p2 && p1 && id==='pwConfirm') {
          return false;
        }
      } else {
        if((p1==='') || (p2==='') || (p2!==p1)) {
          return false;
        }
      }

      return true;
      
    },

    doSaveOnboard : function(event) {
      if(!this.doCheckPasswords()) {
        alert('Please check your passwords...');
        this.$el.find('#pw').focus();
        return;
      }
      event.preventDefault();
      var d = {
        tzOffset: this.$tz.val(),
        amRemindTime: this.$amRemindTime.val(),
        pmRemindTime: this.$pmRemindTime.val(),
        emailAddress: this.$emailAddress.val(),
        hasReminders: this.$hasReminders.val(),
        hasRemindersSMS: this.$hasRemindersSMS.val(),
        mobileNumber: this.$mobileNumber.val(),
        mobileCarrierSMS: this.$mobileCarrierSMS.val(),
        userId: this.userId,
        pw: this.$pw.val()
      };
      $.post(this.wsURL + '/User/SaveOnboard', d, function(data) {
        $.post('/onboard/save', function() {
          window.location.href='/'; 
        })
      }, 'json');
    }

  });

  return OnboardView;

});