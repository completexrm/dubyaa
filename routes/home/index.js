var moment = require('moment');

exports.main = function(req, res) {
	if(!req.session.dubyaaUser) {
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
		res.render('home/home', {
			pageTitle: 'Your Items & Wins',
			activeNav: 'home',
			si: req.sessionID
		});
	}
};
