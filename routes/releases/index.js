var moment = require('moment');

exports.main = function(req, res) {
	res.render('releases/main', {
		pageTitle: 'Release Notes',
		isLoginClass: 'login'
	});
};

exports.bugs = function(req, res) {
	res.render('releases/bugs', {
		pageTitle: 'Known Bugs',
		isLoginClass: 'login'
	});
};