define(['underscore', 'backbone', 'moment', 'jqueryui', 'bootstrap', 'cookie'], function(_, Backbone, moment){

  var ProfileView = Backbone.View.extend({
    events: {
      'change #onboardReminders' : 'toggleRemindTimes',
      'click #saveProfile' : 'doSaveProfile',
      'click .delete-photo' : 'doDeletePhoto',
      'click .do-pw-change' : 'doPWChange'
    },

    initialize : function() {
      // kill ajax caching
      $.ajaxSetup({ cache: false });
      var self = this;
      
      // setup some variables
      this.wsURL = $('body').data('wsurl');
      this.appData = this.$el.find('#appData'), this.userId = this.appData.attr('data-userid');
      this.$paintProfile = this.$el.find('#paintProfile');

      this.setupProfile();

    },

    doPWChange : function(event) {
      var $e = $(event.currentTarget);
      this.$el.find('#pwDisplay').addClass('hide');
      this.$el.find('.pw-hint').removeClass('hide');
      this.$el.find('#pwChange').removeClass('hide');
      this.$el.find('#pw1').focus();
    },

    setupProfile : function() {
      var self=this;
      $.get(this.wsURL + '/User/FetchProfile?id=' + this.userId, function(data) {
        if(data.success) {
          $.post('/profile/paint', data.profile, function(html) {
            self.$paintProfile.html(html);
          }, 'html');
        }
      }, 'json');
    },

    toggleRemindTimes : function(event) {
      var $e = $(event.currentTarget), val = $e.val();
      if(Number(val)===1) {
        this.$remindSections.removeClass('hide');
      } else if(Number(val)===0) {
        this.$remindSections.addClass('hide');;
      }
    },

    doDisableForm : function() {
      this.$el.find('input, select').addClass('disabled').attr('disabled', 'disabled');
    },

    doEnableForm : function() {
      this.$el.find('input, select').removeClass('disabled').removeAttr('disabled');
    },

    doDeletePhoto : function() {
      var self=this, d = {
        userId: this.userId,
        filePath: this.$el.find('#profilePhoto').data('path')
      };
      $.post('/profile/deletePhoto', d);
      self.$el.find('#uploadProfilePhoto').removeClass('hide');
      self.$el.find('.profile-photo').addClass('hide');
    },

    doSaveProfile : function(event) {
      this.doDisableForm();
      $displayName = this.$el.find('#displayName');
      $tagLine = this.$el.find('#tagLine');
      $firstName = this.$el.find('#firstName');
      $lastName = this.$el.find('#lastName');
      $emailAddress = this.$el.find('#emailAddress');
      $tzOffset = this.$el.find('#onboardTimezone');
      $pw1 = this.$el.find('#pw1');
      $pw2 = this.$el.find('#pw2');
      $appHints = this.$el.find('#appHints');
      $hasReminders = this.$el.find('#onboardReminders');
      $hasRemindersSMS = this.$el.find('#onboardRemindersSMS');
      $amRemindTime = this.$el.find('#onboardAMRemindTime');
      $pmRemindTime = this.$el.find('#onboardPMRemindTime');
      $mobileNumber = this.$el.find('#mobileNumber');
      $mobileCarrierSMS = this.$el.find('#mobileCarrierSMS');
      var self=this, $msg = this.$el.find('#saveMsg'), $loader = this.$el.find('#loader'), $e = $(event.currentTarget),
      d = {
        userId: this.userId,
        displayName: $displayName.val(),
        tagLine: $tagLine.val(),
        firstName: $firstName.val(),
        lastName: $lastName.val(),
        emailAddress: $emailAddress.val(),
        tzOffset: $tzOffset.val(),
        pw: $pw1.val(),
        appHints: $appHints.val(),
        hasReminders: $hasReminders.val(),
        hasRemindersSMS: $hasRemindersSMS.val(),
        amRemindTime: $amRemindTime.val(),
        pmRemindTime: $pmRemindTime.val(),
        mobileNumber: $mobileNumber.val(),
        mobileCarrierSMS: $mobileCarrierSMS.val()
      };
      $e.addClass('disabled');
      $loader.removeClass('hide');

      if($pw1.val() !== '') {
        if($pw1.val() !== $pw2.val()) {
          alert('Hey chief, passwords don\'t match..');
          this.doEnableForm();
          $e.removeClass('disabled');
          $loader.addClass('hide');
          $pw1.focus().select();
          return false;
        } else {
          if($pw1.val().length < 5) {
            alert('Sorry...not long enough');
            this.doEnableForm();
            $e.removeClass('disabled');
            $loader.addClass('hide');
            $pw1.focus().select();
            return false; 
          }
        }
      }

      $.post(this.wsURL + '/User/SaveProfile', d, function(data) {
        if(data.success) {
          $.post('/user/saveProfile', d);
          self.doEnableForm();
          $e.removeClass('disabled');
          $loader.addClass('hide');
          $msg.text('Profile has been saved!');
          $msg.removeClass('hide');
          setTimeout(function() {
            $msg.addClass('hide');
          }, 3000);
        }
      }, 'json');
    }

  });

  return ProfileView;

});