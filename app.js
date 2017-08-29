var config = require('./config.json');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var lessMiddleware = require('less-middleware');
var cors = require('cors');
var fs = require('fs');
var multer = require('multer');

var app = express();

app.use(function (req, res, next) {
  res.locals = {
    globalPageTitle: 'Dubyaa :: ',
    wsURL: config.wsURL,
    vStage: config.vStage,
    vMajor: config.vMajor,
    vMinor: config.vMinor,
    vPatch: config.vPatch,
    moment: require('moment'),
    checkActive: function(isActive, isTrial) {
      if(Number(isActive) < 1 && Number(isTrial) < 1){
        return false;
      } else {
        return true;
      }
    }
  };
  next();
});

app.use(cors());
app.use(multer({dest:'./public/uploads/'}));

// styles
app.use(lessMiddleware('/less', {
  dest: '/css',
  pathRoot: path.join(__dirname, 'public')
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/libs',  express.static(__dirname + '/bower_components'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
    secret:'ashdgf823q4gfauwhefg83',
    resave: true,
    saveUninitialized: true
}));

// top level routes
var routes = require('./routes');
var signup = require('./routes/signup');
var home = require('./routes/home');
var login = require('./routes/login');
var logout = require('./routes/logout');
var overlay = require('./routes/overlay');
var todo = require('./routes/todo');
var teams = require('./routes/teams');
var profile = require('./routes/profile');
var account = require('./routes/account');
var onboard = require('./routes/onboard');
var user = require('./routes/user');
var activity = require('./routes/activity');
var messages = require('./routes/messages');
var stats = require('./routes/stats');
var suggestions = require('./routes/suggestions');
var releases = require('./routes/releases');
var ideacloud = require('./routes/ideacloud');

// define routes
// ----------------------------------------------------------
app.get('*', function(req, res, next) {
  res.locals.session = req.session || null;
  next();
});
// Base Route
app.get('/', routes.main);
// Home
app.get('/home', home.main);
// Signup / register
app.get('/signup', signup.main);
// Login / Logout
app.get('/login', login.showForm);
app.get('/login/auto/:key/:email', login.auto);
app.post('/login/session', login.storeSession);
app.get('/login/finish', login.showFinish);
app.get('/logout', logout.logout);
// Todo
app.get('/todo/new', todo.new);
app.get('/todo/newMobile', todo.newMobile);
app.get('/todo/newBacklog', todo.newBacklog);
app.post('/todo/viewTodos', todo.viewTodos);
app.post('/todo/viewTodosMobile', todo.viewTodosMobile);
app.post('/todo/viewTodosBacklogMobile', todo.viewTodosBacklogMobile);
app.post('/todo/viewTodosBacklog', todo.viewTodosBacklogMobile);
app.post('/todo/viewPointsMonth', todo.viewPointsMonth);
app.post('/todo/viewPointsQuarter', todo.viewPointsQuarter);
app.post('/todo/viewPointsYear', todo.viewPointsYear);
app.post('/todo/viewTags', todo.viewTags);
app.post('/todo/listUserPopularTags', todo.listUserPopularTags);
app.post('/todo/loadComments', todo.loadComments);
// Teams
app.get('/teams', teams.main);
app.post('/teams/list', teams.list);
app.post('/teams/listItems', teams.listItems);
// Suggestions
app.get('/suggestions', suggestions.main);
// Activity
app.get('/activity', activity.main);
app.post('/activity/prodList', activity.prodList);
// Messages
app.get('/messages', messages.main);
app.post('/messages/list', messages.list);
// Stats
app.get('/stats', stats.main);
app.post('/stats/leaderboard', stats.leaderboard);
app.get('/stats/:userId', stats.viewUser);
app.post('/stats/showHistory', stats.showHistory);

// Ideacloud
app.get('/ideacloud', ideacloud.main);

// profile
app.get('/profile', profile.main);
app.post('/profile/paint', profile.paint);
app.post('/profile/uploadFile', profile.uploadFile);
app.post('/profile/deletePhoto', profile.deletePhoto);
// Account
app.get('/account', account.main);
app.post('/account/activity', account.viewActivity);
app.get('/account/noActivity', account.noActivity);
app.post('/accountListValues', account.viewValues);
app.post('/accountListLevels', account.viewLevels);
app.post('/accountListUsers', account.viewUsers);
app.post('/accountListTeams', account.viewTeams);
app.post('/accountListSettings', account.viewSettings);
app.post('/accountSaveEmail', account.savePrimaryEmail);
app.post('/account/monthlist', account.monthList);
// Onboard
app.post('/onboard/save', onboard.save);
// User
app.post('/user/saveProfile', user.saveProfile);
app.post('/user/saveGoal', user.saveGoal);
app.post('/user/noAppHints', user.noAppHints);
app.post('/user/listSuggestions', user.listSuggestions);
app.post('/user/listSuggestionsSent', user.listSuggestionsSent);
app.post('/user/listSuggestionsAccount', user.listSuggestionsAccount);
app.post('/user/monthlist', user.monthList);

// Home Overlay
app.get('/overlay/stepOne', overlay.stepOne);
app.get('/overlay/stepZero', overlay.stepZero);
app.get('/overlay/stepTwo', overlay.stepTwo);
app.get('/overlay/stepThree', overlay.stepThree);
app.get('/overlay/stepFour', overlay.stepFour);
app.get('/overlay/stepFive', overlay.stepFive);

// Release notes
app.get('/releases/notes', releases.main);
app.get('/releases/known-bugs', releases.bugs);

app.all('*', function(req, res){
  res.send(404);
})
// ----------------------------------------------------------

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
