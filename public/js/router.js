define([
  'jquery',
  'underscore',
  'backbone'
], function ($, _, Backbone) {
  var AppRouter = Backbone.Router.extend({
    register: function (route, name, path) {
      var self = this;
 
      this.route(route, name, function () {
        var args = arguments;
 
        require([path], function (module) {
          var options = null;
          var parameters = route.match(/[:\*]\w+/g);
          if (parameters) {
            options = {};
            _.each(parameters, function(name, index) {
              options[name.substring(1)] = args[index];
            });
          }
          var page = new module;
        });
      });
    }
  });
 
  var initialize = function(){
    var router = new AppRouter();
    // router.register('*actions', 'DashboardPage', 'views/dashboard/page');
    router.register('', 'homeView', 'views/home/HomeView');
    router.register('login', 'loginView', 'views/login/LoginView');
 
    Backbone.history.start();
  };
 
  return {
    initialize: initialize
  };
});

