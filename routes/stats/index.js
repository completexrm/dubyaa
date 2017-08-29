var moment = require('moment');

exports.main = function(req, res) {
	var sess = req.session;
	if(!sess.dubyaaUser) {
		res.redirect('/login');
	} else {
		var sess = req.session.dubyaaUser;
		if(!res.locals.checkActive(sess.account.isActive, sess.account.isTrial)) {
			if(sess.user.isAccountAdmin) {
				res.redirect('/account?a=1&s=1');
			} else {
				res.redirect('/account?a=0&s=1');
			}
			return;
		}
		res.render('stats/main', {
			pageTitle: 'Statistics',
			user: req.session.dubyaaUser,
			activeNav: 'stats'
		});
	}
};

exports.leaderboard = function(req, res) {
	res.render('stats/viewLeaderboard', {
		leaderboard:  req.body
	});
};

exports.viewUser = function(req, res) {
	res.render('stats/viewUser', {
		statsUserId:  req.param('userId'),
		activeNav: 'stats',
		navGoBack: true,
		goBackURL: 'javascript:history.go(-1)'
	});
};

exports.showHistory = function(req, res) {
	res.render('stats/showHistory', {
		history:  req.body
	});
};