require([ 'js/views/logout/LogoutView' ], function(LogoutView) {
    $(function() {
        new LogoutView({
            'el': $('#login')
        });
    });
});