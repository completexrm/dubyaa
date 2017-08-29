define(['jquery', 'underscore', 'backbone', 'bootstrap', 'cookie', 'md5'], function($, _, Backbone){
  
  return Backbone.View.extend({
  
    events: {
      'click #doLogin' : 'doLogin',
      'click #doHelp' : 'doHelp',
      'click .toggle-form' : 'toggleForm'
    },

    initialize : function() {
      var self=this;
      this.userUsername = this.$el.find('#loginUsername');
      this.userPassword = this.$el.find('#loginPassword');
      this.userKeepLogin = this.$el.find('#loginKeepMe');
      this.isUserHash = this.$el.find('#isUH');
      this.wsURL = $('body').data('wsurl');
      this.checkCookie();
      $('body').on('keydown', function(event) {
        code = (event.which) ? event.which : event.keyCode;
        if(code===13) {
          self.doLogin();
        }
      });
    },

    checkCookie : function() {
      var self=this,
      loginUser = $.cookie('dubyaaKeepLoginU'),
      loginPass = $.cookie('dubyaaKeepLoginH');
      if(typeof loginUser !== 'undefined' && typeof loginPass !== 'undefined') {
        this.userUsername.val(loginUser);
        this.userPassword.val(loginPass);
        this.userKeepLogin.prop('checked', true);
        this.isUserHash.val('1');
        setTimeout(function() {
          self.$el.find('#doLogin').trigger('click');
        }, 100);

      } else {
        this.userUsername.focus();
        this.isUserHash.val('0');
      }
    },

    doLogin : function(event) {
      console.log('LoginView::doLogin');
      var username = this.userUsername.val(),
      password = this.userPassword.val(),
      isUH = this.isUserHash.val(),
      self=this;
      var d = {
        emailAddress: username,
        pw: password,
        isUH: isUH
      };
      self.disableForm();
      // authenticate against username / pass
      $.post(this.wsURL + '/Authenticate/Go', d, function(data) {
        // build user object from results if authenticated
        var d = {
          user: data.user,
          prefs: data.prefs,
          account: data.account
        };
        // setup cookie to auto login on return
        if(self.userKeepLogin.prop('checked')===true) {
          $.cookie('dubyaaKeepLoginU', username, {expires: 90});
          $.cookie('dubyaaKeepLoginH', data.user.userHash, {expires: 90});
        } else {
          $.removeCookie('dubyaaKeepLoginU');
          $.removeCookie('dubyaaKeepLoginH');
        }
        // setup client side session
        $.post('/login/session', d, function(data) {
          // store session and user data in user_session table
          $.post(self.wsURL + '/Authenticate/StoreSession', data.data, function() {
          }).always(function() {
            window.location = '/login/finish';
          });
        }, 'json');
      }, 'json').fail(function() {
        self.enableForm();
        self.userUsername.focus();
        alert('Check your email / password, and try again.');
      });
    },

    disableForm : function() {
      this.userUsername.attr('disabled', 'disabled');
      this.userPassword.attr('disabled', 'disabled');
      this.$el.find('#doLogin').addClass('disabled');
    },

    enableForm : function() {
      this.userUsername.removeAttr('disabled');
      this.userPassword.removeAttr('disabled');
      this.$el.find('#doLogin').removeClass('disabled');
    },

    doHelp : function(event) {
      var self=this, emailAddress = this.$el.find('#helpEmail').val(),
      d = {
        emailAddress: emailAddress
      };
      $.post(this.wsURL + '/Authenticate/Help', d, function(data) {
        if(data.success) {
          alert('Check your inbox for login help!');
          self.toggleForm();
        } else {
          alert('There was a problem sending to your email address');
        }
      }, 'json');
    },
    
    toggleForm : function() {
      var $login = this.$el.find('#loginForm'),
      $help = this.$el.find('#helpForm');
      $login.toggleClass('hide');
      $help.toggleClass('hide');
      if(!$login.hasClass('hide')) {
        $login.find('#loginUsername').focus();
        $help.find('#helpEmail').val('');
      }
      if(!$help.hasClass('hide')) {
        $login.find('#loginUsername').val('');
        $login.find('#loginPassword').val('');
        $help.find('#helpEmail').focus();
      }
    }
  });
});