var require = {
    paths : {
        'jquery' : "/libs/jquery/dist/jquery.min",
        'jqueryui' : "/libs/jqueryui/jquery-ui",
        'timepicker' : "/js/vendor/timepicker.min",
        'underscore' : "/libs/underscore/underscore",
        'backbone' : "/libs/backbone/backbone",
        'bootstrap' : "/libs/bootstrap/dist/js/bootstrap.min",
        'moment' : "/libs/moment/moment",
        'cookie' : "/libs/jquery-cookie/jquery.cookie",
        'md5' : "/libs/md5/md5",
        'chartjs' : "/libs/chartjs/Chart.min",
        'dubCommon' : "/js/controllers/common",
        'setGoal' : "/js/controllers/modalSetGoal",
        'modalTeam' : "/js/controllers/modalTeam",
        'modalLevel' : "/js/controllers/modalLevel",
        'modalUser' : "/js/controllers/modalUser",
        'modalSuggest' : "/js/controllers/modalSuggest",
        'modalIdea' : "/js/controllers/modalIdea",
        'onboard' : "/js/controllers/modalOnboard",
        'instawin' : "/js/controllers/modalNewInstawin"        
    },
    waitSeconds: 0,
    shim : {
        'backbone' : {
            deps : [ 'underscore', 'jquery' ],
            exports : 'Backbone'
        },
        'underscore' : {
            exports : '_'
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'jqueryui': {
            deps: ['jquery']
        },
        'raphael': {
            exports: 'Raphael'
        }
    }
};