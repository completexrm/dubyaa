require([ 'js/views/login/LoginView' ], function(LoginView) {
    $(function() {
        new LoginView({
            'el': $('#login')
        });
    });
});