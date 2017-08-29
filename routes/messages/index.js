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
		res.render('messages/main', {
			pageTitle: 'Messages',
			user: req.session.dubyaaUser,
			activeNav: 'messages'
		});
	}
};

exports.list = function(req, res) {
	res.render('messages/viewList', {
		messages:  req.body,
		userId: req.session.dubyaaUser.user.id
	});
};
