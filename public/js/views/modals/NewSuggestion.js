define(['underscore', 'backbone', 'moment', 'jqueryui', 'bootstrap', 'cookie'], function(_, Backbone, moment){

  var NewSuggestionView = Backbone.View.extend({
    
    events: {
      'click #sendSuggestion' : 'doSendSuggestion',
      'click .do-go' : 'doShowSlide',
      'click .option-select' : 'doOptionSelect',
      'click #doGoReward' : 'doCheckUserSelect',
      'click #doSaveSuggestion' : 'doSaveSuggestion',
      'shown.bs.modal #newSuggestion' : 'focusSuggestion'
    },

    initialize : function() {
      // kill ajax caching
      $.ajaxSetup({ cache: false });
      var self = this;
      this.wsURL = $('body').data('wsurl');
      this.$modal = this.$el.find('#newSuggestion');
      // setup some variables
      this.appData = $('#appData'), 
      this.userId = this.appData.attr('data-userid');
      this.acctId = this.appData.attr('data-acctid');
    },

    focusSuggestion : function() {
      this.$modal.find('#suggestion').focus();
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

    doShowSlide : function(event) {
      var self=this, $e=$(event.currentTarget), next = $e.data('go');
      var selectedUser = this.$el.find('select#userId').val(),
      $userAssign = this.$el.find('.specific-user'),
      $yesReward = this.$el.find('.yes-reward'), reward = this.$el.find('textarea#reward').val();
      if($e.attr('id')==='doGoReward'  && $userAssign.hasClass('active') && Number(selectedUser)==='') {
        alert('Please select some to give this to!');
        return;
      }
      if($e.attr('id')==='doGoSuggestion'  && $yesReward.hasClass('active') && reward==='') {
        alert('Wait! There is no reward!');
        this.$el.find('#reward').focus().select();
        return;
      }
      this.$el.find('.new-suggestion').addClass('hide');
      this.$el.find('.new-suggestion[data-step="' + next + '"]').removeClass('hide');
    },

    doOptionSelect : function(event) {
      var self=this, $e=$(event.currentTarget), $options = $e.closest('.options'), $list = this.$el.find('select#userId');
      $options.find('.option-select').toggleClass('active');
      if($e.hasClass('specific-user') && $e.hasClass('active')) {
        $.get(this.wsURL + '/Account/FetchUsers?accountId=' + this.acctId, function(data) {
          $.each(data.users, function(i, v) {
            $list.append('<option value="' + v.id + '">' + v.displayName + '</option');
          });
        }, 'json');
        this.$el.find('.user-select').removeClass('hide');
      }
      if($e.hasClass('all-users') && $e.hasClass('active')) {
        this.$el.find('.user-select').addClass('hide');
      }
      if($e.hasClass('yes-reward') && $e.hasClass('active')) {
        this.$el.find('.reward-description').removeClass('hide').find('textarea').focus().select();
      }
      if($e.hasClass('no-reward') && $e.hasClass('active')) {
        this.$el.find('.reward-description').addClass('hide');
      }
    },

    doCheckMissing : function(event) {
      var $e = $(event.currentTarget), v = $e.val();
      if(v!=='') {
        $e.removeClass('required-missing');
      }
    },

    doSaveSuggestion : function(event) {
      var $e = $(event.currentTarget), self=this,
      suggestion = this.$el.find('#suggestion').val(),
      d = {
        suggestion: this.$modal.find('#suggestion').val(),
        reward: this.$modal.find('#reward').val(),
        toId: this.$modal.find('#userId').val(),
        accountId: this.acctId,
        fromId: this.userId
      };
      if(suggestion==='') {
        alert('Easy there champ...there is no suggestion!');
        this.$el.find('#suggestion').focus().select();
        return;
      }
      $.post(this.wsURL + '/Todo/Suggestion', d, function(data) {
        if(!data.success) {
          alert('Something went sideways...sorry :(')
        }
        self.$modal.modal('hide');
      }, 'json');
    }

  });

  return NewSuggestionView;

});