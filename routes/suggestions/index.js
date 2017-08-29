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
		res.render('suggestions/main', {
			pageTitle: 'Suggestions',
			user: req.session.dubyaaUser,
			activeNav: 'suggestions'
		});
	}
};
