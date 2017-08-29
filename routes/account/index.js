var moment = require('moment');

exports.main = function(req, res) {
	if(!req.session.dubyaaUser) {
		res.redirect('/login');
	} else {
		var a = req.param('a');
		var s = req.param('s');
		var includeType;
		if(Number(s)===1){
			if(Number(a)===1)
				viewType='suspendedAdmin';
			else {
				viewType='suspendedUser';
			}
		} else {
			viewType = '';
		}
		res.render('account/main', {
			pageTitle: 'Account',
			activeNav: '',
			includeType: includeType
		});
	}
};

exports.viewActivity = function(req, res) {
	res.render('account/viewActivity', {
		activities:  req.body,
		loginUser: req.session.dubyaaUser.user
	});
};

exports.noActivity = function(req, res) {
	res.render('account/noActivity');
};

exports.viewTeams = function(req, res) {
	res.render('account/viewTeams', {
		teams:  req.body
	});
};

exports.viewValues = function(req, res) {
	res.render('account/viewValues', {
		values:  req.body
	});
};

exports.viewLevels = function(req, res) {
	res.render('account/viewLevels', {
		levels:  req.body
	});
};

exports.viewUsers = function(req, res) {
	res.render('account/viewUsers', {
		users:  req.body
	});
};

exports.viewSettings = function(req, res) {
	res.render('account/viewSettings', {
		settings:  req.body
	});
};

exports.savePrimaryEmail = function(req, res) {
	req.session.dubyaaUser.account.primaryEmail = req.body.primaryEmail;
	res.json({
		success: true
	});
};

exports.monthList = function(req, res) {
	res.render('stats/monthList', {
		months:  req.body
	});
};