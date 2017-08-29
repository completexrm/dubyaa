define(['underscore', 'backbone', 'moment', 'jqueryui', 'bootstrap', 'cookie'], function(_, Backbone, moment){

  var AccountView = Backbone.View.extend({
    
    events: {
      'click .toggle-email' : 'doToggleEmail',
      'click .delete-user' : 'doDeleteUser',
      'click .delete-team' : 'doDeleteTeam',
      'click .delete-level' : 'doDeleteLevel',
      'click #saveEmail' : 'doSaveEmail',
      'click .toggle-payment' : 'doTogglePayment',
      'click .change-team-lead' : 'setupTeamLeadForm',
      'click .change-team' : 'setupTeamForm',
      'click .edit-team' : 'setupEditTeamForm',
      'click .edit-level' : 'setupEditLevelForm',
      'click .edit-user' : 'setupEditUserForm',
      'hidden.bs.modal #newUser' : 'setupUI',
      'hidden.bs.modal #newValue' : 'setupValues',
      'hidden.bs.modal #newTeam' : 'setupUI',
      'hidden.bs.modal #newLevel' : 'setupUI',
      'hidden.bs.modal #changeTeamLead' : 'fetchAccountTeams',
      'hidden.bs.modal #changeTeam' : 'fetchAccountTeams',
      'hidden.bs.modal #editTeam' : 'fetchAccountTeams',
      'hidden.bs.modal #editLevel' : 'fetchAccountLevels',
      'hidden.bs.modal #editUser' : 'fetchAccountUsers'
    },

    initialize : function() {
      // kill ajax caching
      $.ajaxSetup({ cache: false });
      var self = this;
      // setup some variables
      this.wsURL = $('body').data('wsurl');
      this.appData = this.$el.find('#appData'), 
      this.userId = this.appData.attr('data-userid'), 
      this.acctId = this.appData.attr('data-accountid');
      this.setupUI();
      // this.setupValues();
    },

    setupUI : function() {
      this.fetchAccountTeams();
      this.fetchAccountUsers();
      this.fetchAccountLevels();
    },

    setupValues : function() {
      this.fetchAccountValues();
    },

    setupTeamLeadForm : function(event) {
      var $e = $(event.currentTarget), teamId = $e.data('team-id'), teamLeadId = $e.data('team-lead-id');
      this.$el.find('#changeTeamLead.modal')
        .find('#teamId').val(teamId);
      this.$el.find('#changeTeamLead.modal')
        .find('#teamLeadId').val(teamLeadId);
    },

    setupTeamForm : function(event) {
      var $e = $(event.currentTarget), teamId = $e.attr('data-id');
      var $f = this.$el.find('#changeTeam');
      $f.find('#teamId').val(teamId);
      $.get(this.wsURL + '/Team/FetchRoster?id=' + teamId, function(data) {
        $f.find('input.user-include')
          .prop('checked', false)
          .attr('data-team-id', teamId);
        $.each(data.users, function(i, v) {
          $f.find('input.user-include[data-user-id="' + v + '"]').prop('checked', true);
        });
      }, 'json');
    },

    setupEditTeamForm : function(event) {
      var $e = $(event.currentTarget), teamId = $e.attr('data-id'), displayName = $e.attr('data-name');
      this.$el.find('#editTeam.modal')
        .find('#teamId').val(teamId);
      this.$el.find('#editTeam.modal')
        .find('#displayName').val(displayName);
    },

    setupEditLevelForm : function(event) {
      var $e = $(event.currentTarget), levelId = $e.attr('data-id'), label = $e.attr('data-label'),
      valueLo = $e.attr('data-valuelo'), valueHi = $e.attr('data-valuehi');
      this.$el.find('#editLevel.modal')
        .find('#levelId').val(levelId);
      this.$el.find('#editLevel.modal')
        .find('#label').val(label);
      this.$el.find('#editLevel.modal')
        .find('#valueLo').val(valueLo);
      this.$el.find('#editLevel.modal')
        .find('#valueHi').val(valueHi);
    },

    setupEditUserForm : function(event) {
      var $e = $(event.currentTarget), 
      userId = $e.data('id'), 
      displayName = $e.data('display'),
      firstName = $e.data('first'),
      lastName = $e.data('last'),
      isAccountAdmin = $e.data('admin'),
      emailAddress = $e.data('email');

      this.$el.find('#editUser.modal').find('#userId').val(userId);
      this.$el.find('#editUser.modal').find('#displayName').val(displayName);
      this.$el.find('#editUser.modal').find('#firstName').val(firstName);
      this.$el.find('#editUser.modal').find('#lastName').val(lastName);
      this.$el.find('#editUser.modal').find('#emailAddress').val(emailAddress);
      this.$el.find('#editUser.modal').find('#isAccountAdmin').prop('checked', false);
      if(isAccountAdmin===1){
        this.$el.find('#editUser.modal').find('#isAccountAdmin').prop('checked', true);
      }
    },

    fetchAccountTeams : function() {
      var self=this, d = {
        accountId: this.acctId
      };
      $.get(this.wsURL + '/Account/FetchTeams', d, function(data) {
        if(typeof data.teams!=='undefined' && data.teams!==null) {
          $.post('/accountListTeams', data.teams, function(data) {
            self.$el.find('#noTeams').addClass('hide');
            self.$el.find('#accountTeamList').html(data).removeClass('hide');
          }, 'html');
        } else {
          self.$el.find('#noTeams').removeClass('hide');
          self.$el.find('#accountTeamList').addClass('hide');
        }
        $('#newUserTeam').html('<option value="">...</option>');
        if(data.teams !== null) {
          $('.new-user-team-elements').removeClass('hide');
          $.each(data.teams, function(i, v) {
            var $option = '<option value="' + v.id + '">' + v.displayName + '</option>';
            $('#newUserTeam').append($option);
          });
        } else {
          $('.new-user-team-elements').addClass('hide');
        }
      }, 'json');
    },

    fetchAccountUsers : function() {
      var self=this, d = {
        accountId: this.acctId
      };
      $.get(this.wsURL + '/Account/FetchUsers', d, function(data) {
        $.post('/accountListUsers', data.users, function(data) {
          self.$el.find('#accountUserList').html(data);
          $('a.delete-user[data-id="' + self.userId + '"]').remove();
        }, 'html');
        $('#teamLeadId').html('');
        if(data.users !== null) {
          var teamUserRoster = '';
          $.each(data.users, function(i, v) {
            var $option = '<option value="' + v.id + '">' + v.displayName + '</option>';
            $('#teamLeadId').append($option);
            teamUserRoster += '<div class="clearfix w100"><div class="pull-left w10 align-center"><div class="p5r m5r border-right"><input class="user-include" data-user-id="' + v.id + '" type="checkbox" /></div></div><div class="pull-left w90">' + v.displayName + '</div></div>';
          });
          $('#changeTeam .team-roster').html(teamUserRoster);
        }
      }, 'json');
    },

    fetchAccountValues : function() {
      var self=this, d = {
        accountId: this.acctId
      };
      $.get(this.wsURL + '/Account/FetchValues', d, function(data) {
        $.post('/accountListValues', data.values, function(data) {
          self.$el.find('#accountValueList').html(data);
        }, 'html');
      }, 'json');
    },

    fetchAccountLevels : function() {
      var self=this, d = {
        accountId: this.acctId
      };
      $.get(this.wsURL + '/Account/FetchLevels', d, function(data) {
        if(typeof data.levels!=='undefined' && data.levels!==null) {
          $.post('/accountListLevels', data.levels, function(data) {
            self.$el.find('#noLevels').addClass('hide');
            self.$el.find('#accountLevelList').html(data).removeClass('hide');
          }, 'html');
        } else {
          self.$el.find('#noLevels').removeClass('hide');
          self.$el.find('#accountLevelList').addClass('hide');
        }
      }, 'json');
    },

    doToggleEmail : function(event) {
      this.$el.find('.toggle-email-selector').toggleClass('hide');
      if(this.$el.find('#emailEdit').is(':visible')) {
        this.$el.find('#emailEdit input').focus();
      }
    },

    doTogglePayment : function(event) {
      this.$el.find('.toggle-payment-selector').toggleClass('hide');
      if(this.$el.find('#paymentEdit').is(':visible')) {
        this.$el.find('#paymentEdit input.initial-focus').focus();
      }
    },

    doSaveEmail : function(event) {
      
      var self=this, $e = $(event.currentTarget),
      $loader = this.$el.find('#saveEmailLoader'),
      $emailLabel = this.$el.find('#emailLabel span.data');
      
      $loader.removeClass('hide');
      $e.addClass('hide');

      var email = this.$el.find('#primaryEmail').val();
      
      if(!email) {
        alert('Please enter a valid email!');
        return;
      }

      var d = {
        primaryEmail: email,
        userId: this.userId,
        accountId: this.acctId
      };

      // save to db
      $.post(this.wsURL + '/Account/SavePrimaryEmail', d, function(data) {
        if(data.success) {
          $emailLabel.text(d.primaryEmail);
          self.doToggleEmail();
          $e.removeClass('hide');
          $loader.addClass('hide');
          // save to client session
          $.post('/accountSaveEmail', d);
        }
      }, 'json');
    },

    doDeleteUser : function(event) {
      var self=this, $e = $(event.currentTarget), 
      id = $e.attr('data-id'), 
      name = $e.attr('data-name'),
      email = $e.attr('data-email');
      if(confirm('Are you sure you want to delete ' + name + '?')) {
        $.post(this.wsURL + '/User/Delete', {id: id, userId: this.userId}, function(data) {
          if(data.success===true) {
            self.setupUI();
            $.post(self.wsURL + '/Email/UserDeleted', { displayName: name, emailAddress: email });
          }
        }, 'json');
      }
    },

    doDeleteTeam : function(event) {
      var self=this, $e = $(event.currentTarget), 
      id = $e.attr('data-id'), 
      name = $e.attr('data-name');
      if(confirm('Are you sure you want to delete ' + name + '?')) {
        $.post(this.wsURL + '/Team/Delete', {teamId: id, userId: this.userId}, function(data) {
          if(data.success===true) {
            self.setupUI();
          }
        }, 'json');
      }
    },

    doDeleteLevel : function(event) {
      var self=this, $e = $(event.currentTarget), 
      id = $e.attr('data-id'), 
      label = $e.attr('data-label');
      if(confirm('Are you sure you want to delete ' + label + '?')) {
        $.post(this.wsURL + '/Account/DeleteLevel', {id: id, userId: this.userId}, function(data) {
          if(data.success===true) {
            self.fetchAccountLevels();
          }
        }, 'json');
      }
    }
  });

  return AccountView;

});