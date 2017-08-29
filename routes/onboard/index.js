exports.save =  function(req, res){
	req.session.dubyaaUser.user.isFirstLogin = '0';
	res.json({
		success: true
	});
};