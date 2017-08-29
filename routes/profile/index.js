var moment = require('moment');
var fs = require('fs');
var request = require('request');

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
		res.render('profile/main', {
			pageTitle: 'Your Profile',
			user: req.session.user,
			activeNav: 'profile'
		});
	}
};

exports.paint = function(req, res) {
	res.render('profile/paintProfile', {
		profile:  req.body,
		user: req.session.dubyaaUser.user
	});
};

exports.uploadFile = function(req, res) {
	var fileName = req.files.profilePhoto.name;
	var userId = req.body.userId;
	request.post(
	    res.locals.wsURL + '/User/SavePhoto',
	    { 
	    	form: { 
	    		photoPath: fileName, 
	    		userId: userId
	    	}
	    },
	    function (error, response, body) {
			if(response.statusCode===200) {
				req.session.dubyaaUser.user.photoPath = fileName;
				res.redirect('/profile');
			}
	    }
	);
};

exports.deletePhoto = function(req, res) {
	fs.unlink('./public/uploads/' + req.body.filePath);
	request.post(
	    res.locals.wsURL + '/User/DeletePhoto',
	    { 
	    	form: { 
	    		userId: req.body.userId
	    	}
	    },
	    function (error, response, body) {
			if(response.statusCode===200) {
				req.session.dubyaaUser.user.photoPath = '';
			}
			res.send(response.statusCode);
	    }
	);
};