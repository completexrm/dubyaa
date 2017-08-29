define(['jquery', 'underscore', 'backbone', 'bootstrap', 'cookie'], function($, _, Backbone){
  return Backbone.View.extend({
    events: {
      'click .go-back' : 'doGoBack',
      'click #accountType .account-search' : 'doAccountSearch',
      'click #accountType .account-create' : 'doAccountCreate',
      'click .go-team' : 'doUserTeam',
      'click .team-later' : 'doTeamLater',
      'click .go-profile' : 'doUserProfile',
      'blur #registrationKey' : 'doValidateKey',
      'click .change-key a' : 'doChangeKey',
      'blur #userProfile input' : 'doValidateProfile',
      'click #finishSignup' : 'doFinishSignup',
      'click .add-team' : 'doAddTeam',
      'click .delete-team' : 'doDeleteTeam',
      'blur .team-name' : 'doCheckTeams'
    },

    initialize : function() {
        var self=this;
        this.wsURL = $('body').data('wsurl');
        this.pwLength = 8;
        this.regKey = this.$el.find('#registrationKey');
        
        this.$existing = this.$el.find('#accountSearch');
        this.$create = this.$el.find('#accountCreate');
        this.$team = this.$el.find('#userTeam');
        this.$profile = this.$el.find('#userProfile');
        this.$finish = this.$el.find('#finishWait');
        
        this.$create.find('input').val('');
        this.$profile.find('input').val('');
        this.regKey.val('').removeAttr('disabled');

        this.$regEmail = this.$el.find('#emailAddress').focus();
        this.$regEmail.focus();

    },

    hideSteps : function() {
    	this.$el.find('.signup-step').addClass('hide');
    },

    doGoBack : function(event) {
    	var $e = $(event.currentTarget), step = $e.data('step');
    	this.hideSteps();
        if(step===2) {
            if(this.$el.find('#registrationKey').val()!=='') {
                this.$el.find('.signup-step[data-step="2a"]').removeClass('hide');
            } else {
                this.$el.find('.signup-step[data-step="2b"]').removeClass('hide');
            }
        } else {
            this.$el.find('.signup-step[data-step="'+step+'"]').removeClass('hide');
        }
    },

    doAccountCreate : function(event) {
        emailAddress = this.$regEmail.val();
        var self=this;
        if(!self.doCheckEmailAddress(self.$regEmail)) {
            self.$regEmail.focus();
            return;
        }
    },

    snagEmail : function($e) {
        var email = $e.val(), isSnag = $e.attr('data-snag');
        var d = {
            emailAddress: email
        }
        if(Number(isSnag) < 1) {
            $.post(this.wsURL + '/Account/SnagEmail', d, function() {
                $e.attr('data-snag', 1);
            });
        }
    },

    doAccountSearch : function(event) {
        var emailAddress = this.$regEmail.val();
        if(!emailAddress) {
            alert('We need this for your username!')
            this.$regEmail.focus();
            return;
        }       
    	this.hideSteps();
        this.$create.find('#newAccountName').val('');
    	this.$existing
            .removeClass('hide');
        this.regKey.focus();
    },

    doUserTeam : function(event) {
        if(!this.doCheckAccountName()) {
            alert('Please enter an Account name');
            this.$el.find('#newAccountName').focus();
            return;
        }
        this.hideSteps();
        this.$team
            .removeClass('hide')
            .find('.initial-focus').focus();
    },

    doTeamLater : function() {
        this.$el.find('.team-name').each(function() {
            this.value='';
        })
        this.$el.find('.new-team').not('.new-team-template').remove();
    },

    doUserProfile : function(event) {
        this.hideSteps();
        this.$profile
            .removeClass('hide')
            .find('#profileFirstName input').focus();
    },

    doValidateKey : function(event) {
        var $e = $(event.currentTarget), key = $e.val(), self=this,
        previousKey = $e.attr('data-previous');
        d = {
            'key': key
        };
        if(key.length && key !== previousKey) {
            $e.attr('data-previous', key);
            $.post(this.wsURL + '/Account/ValidateKey', d, function(data) {
                if(data.success) {
                    self.doValidKey();
                    self.$el.find('#displayName')
                        .removeClass('hide')
                        .find('.tag')
                            .text(data.displayName);
                }
            }, 'json').fail(function() {
                self.doInvalidKey();
            });
        }
    },

    doValidateProfile : function(event) {
        var $e = $(event.currentTarget), id = $e.attr('id');
        var $ok = $e.parent().next().find('.status-ok');
        var $err = $e.parent().next().find('.status-notok');
        switch(id) {
            case 'password': 
                this.doCheckPassword($e);
                break;
            default:
                this.doCheckFirstLastName($e);
        }
        var errors = this.$el.find('.status-notok:visible').length;
        if(errors === 0) {
            this.$profile.find('#finishSignup').removeClass('disabled');
        }
    },

    doCheckFirstLastName : function($e) {
        var v = $e.val(), $ok, $err;
        $ok = $e.parent().next().find('.status-ok');
        $err = $e.parent().next().find('.status-notok');
        if(v!=='') {
            $ok.removeClass('hide');
            $err.addClass('hide');
        } else {
            $ok.addClass('hide');
            $err.removeClass('hide');
        }
    },

    doCheckPassword : function($e) {
        var v = $e.val(), $ok, $err;
        $ok = $e.parent().next().find('.status-ok');
        $err = $e.parent().next().find('.status-notok');
        if(v=='' || !v || v.length < this.pwLength) {
            $err.removeClass('hide');
            $ok.addClass('hide');
            return;
        }
        $err.addClass('hide');
        $ok.removeClass('hide');
    },

    doCheckAccountName : function(event) {
        var name = this.$el.find('#newAccountName').val();
        if(name.length===0) {
            return false;
        }
        return true;
    },

    doChangeKey : function(event) {
        this.$existing.find('#displayName').addClass('hide');
        this.$existing.find('.key-status').addClass('hide');
        this.$existing.find('.go-profile').addClass('disabled');
        this.regKey
            .removeAttr('disabled')
            .removeAttr('data-previous')
            .val('')
            .focus();
    },

    doValidKey : function() {
        this.$existing.find('.key-status').addClass('hide');
        this.$existing.find('#keyValid').removeClass('hide');
        this.$existing.find('.go-profile').removeClass('disabled');
        this.$existing.find('.change-key').removeClass('hide');
        this.regKey.attr('disabled', 'disabled');
    },

    doInvalidKey : function() {
        this.$el.find('.key-status').addClass('hide');
        this.$el.find('#keyInvalid').removeClass('hide');
        this.regKey.focus().select();
    },

    validEmailAddress : function(email) {
        var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
        return pattern.test(email);
    },

    doCheckEmailAddress : function($e) {
        var v = $e.val(), $ok, $err, self=this;
        if(this.validEmailAddress(v)) {
            $.get(this.wsURL + '/Account/EmailAvailable?email='+v, function(res) {
                if(res.success) {
                    self.snagEmail($e);
                    self.$el.find('#userProfileEntries .profile-email-address').text(emailAddress);
                    self.hideSteps();
                    self.doChangeKey();
                    self.$create
                        .removeClass('hide')
                        .find('#newAccountName')
                            .focus();
                } else {
                    alert('This email address is already registered');
                }
            }, 'json');
        } else {
            alert('This is not a valid email address');
            return false;
        }
        return true;
    },

    doAddTeam : function() {
        var $template = this.$el.find('.new-team-template').clone();
        $template.toggleClass('new-team-template hide');
        this.$el.find('#teams')
            .append($template)
            .find('.new-team').last()
                .removeClass('hide')
                .find('.team-name').focus();
    },

    doDeleteTeam : function(event) {
        var $e = $(event.currentTarget);
        $e.closest('.new-team').remove();
    },

    doCheckTeams : function() {
        var self=this, $fields = this.$el.find('.team-name:visible'), empty=0;
        $fields.each(function() {
            var val = this.value;
            if($.trim(val)==='') {
                empty++;
            }
        });
        if(empty===$fields.length) {
            self.$el.find('#saveTeams').addClass('disabled'); 
        } else {
            self.$el.find('#saveTeams').removeClass('disabled');
        }
    },

    doFinishSignup : function() {
        var self=this, $fields = this.$el.find('.team-name'), teamNames = [];
        $fields.each(function() {
            var name = $.trim(this.value);
            if(name!=='') {
                teamNames.push(name);
            }
        });
        var d = {
            firstName: this.$profile.find('#firstName').val(),
            lastName: this.$profile.find('#lastName').val(),
            emailAddress: this.$el.find('#emailAddress').val(),
            password: this.$profile.find('#password').val(),
            key: this.$existing.find('#registrationKey').val(),
            displayName: this.$create.find('#newAccountName').val(),
            teamNames: teamNames
        };
        if(d.key || d.displayName) {
            this.hideSteps();
            this.$finish.removeClass('hide');
            $.post(this.wsURL + '/Email/Welcome', d);
            $.post(this.wsURL + '/Account/Register', d, function(data) {
                window.location.href='/login/auto/'+data.user.autoLoginKey+'/'+data.user.emailAddress;
            });
        }
    }

  });
});