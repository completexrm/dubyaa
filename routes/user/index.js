exports.saveProfile =  function(req, res){
	req.session.dubyaaUser.user.displayName = req.body.displayName;
	req.session.dubyaaUser.user.firstName = req.body.firstName;
	req.session.dubyaaUser.user.lastName = req.body.lastName;
	req.session.dubyaaUser.prefs.tzOffset = req.body.tzOffset;
	req.session.dubyaaUser.prefs.appHints = req.body.appHints;
	req.session.dubyaaUser.prefs.hasReminders = req.body.hasReminders;
	req.session.dubyaaUser.prefs.hasRemindersSMS = req.body.hasRemindersSMS;
	req.session.dubyaaUser.prefs.amRemindTime = req.body.amRemindTime;
	req.session.dubyaaUser.prefs.pmRemindTime = req.body.pmRemindTime;
	req.session.dubyaaUser.user.mobileCarrierSMS = req.body.mobileCarrierSMS;
	req.session.dubyaaUser.user.mobileNumber = req.body.mobileNumber;
	res.json({
		dubyaaUser: req.session.dubyaaUser
	});
};

exports.saveGoal =  function(req, res){
	req.session.dubyaaUser.prefs.avgPointsDay = req.body.avgPointsDay;
	res.json({
		dubyaaUser: req.session.dubyaaUser
	});
};

exports.noAppHints =  function(req, res){
	req.session.dubyaaUser.prefs.appHints = '0';
	res.json({
		dubyaaUser: req.session.dubyaaUser
	});
};

exports.listSuggestions = function(req, res) {
	res.render('suggestions/view', {
		suggestions:  req.body,
		dubyaaUser: req.session.dubyaaUser
	});
};

exports.listSuggestionsSent = function(req, res) {
	res.render('suggestions/viewSent', {
		suggestions:  req.body,
		dubyaaUser: req.session.dubyaaUser
	});
};

exports.listSuggestionsAccount = function(req, res) {
	res.render('suggestions/viewAccount', {
		suggestions:  req.body,
		dubyaaUser: req.session.dubyaaUser
	});
};
exports.monthList = function(req, res) {
	res.render('stats/monthList', {
		months:  req.body
	});
};