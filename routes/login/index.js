var os = require('os');

exports.showForm =  function(req, res){
    res.render('login/form', {
    	pageTitle: 'Login',
    	isLoginClass: 'login'
    });
};

exports.storeSession =  function(req, res){
	var ua = req.headers['user-agent'], uaType, uaVersion, uaMobile;
	var ip = req.headers['x-forwarded-for'] || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
	req.session.dubyaaUser = req.body;

	uaMobile = 0;
	if (/mobile/i.test(ua))
	    uaMobile = 1;

	if (/like Mac OS X/.test(ua))
		uaType = 'iOS';
	if (/Android/.test(ua))
	    uaType = 'Android';
	if (/webOS\//.test(ua))
		uaType = 'webOS';
	if (/(Intel|PPC) Mac OS X/.test(ua))
	    uaType = 'Mac';
	if (/Windows NT/.test(ua))
	    uaType = 'Windows';

	req.session.dataPlatform = {
		uaType: uaType,
		uaVersion: uaVersion,
		uaMobile: uaMobile,
		ipAddress: ip,
	};

	res.json({
		dubyaaUser: req.session.dubyaaUser,
		data: {
			userId: req.session.dubyaaUser.user.id,
			accountId: req.session.dubyaaUser.user.accountId,
			uaType: uaType,
			uaVersion: uaVersion,
			uaMobile: uaMobile,
			ipAddress: ip,
			sessionId: req.sessionID
		}
	});
};

exports.showFinish =  function(req, res){
	res.render('login/finish', {
		pageTitle: 'Finishing Login...',
		isLoginClass: 'login'
	});
};

exports.auto = function(req, res) {
	res.render('login/auto', {
		title: 'Finishing Login...',
		key: req.param('key'),
		email: req.param('email'),
		isLoginClass: 'login'
	});
}