exports.logout =  function(req, res){
	var si = req.sessionID;
	req.session.destroy();
	res.render('login/logout', {
    	pageTitle: 'Tidying up...',
    	si: si,
    	isLoginClass: 'login'
    });
};