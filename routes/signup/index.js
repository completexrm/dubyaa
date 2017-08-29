exports.main =  function(req, res){
    res.render('signup/main', {
    	pageTitle: 'Signup for Free',
    	isLoginClass: 'login'
    });
};