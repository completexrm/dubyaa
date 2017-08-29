require([ 'js/views/signup/SignupView' ], function(SignupView) {
    $(function() {
        new SignupView({
            'el': $('#signup')
        });
    });
});