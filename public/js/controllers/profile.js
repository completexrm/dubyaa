require([ 'js/views/profile/ProfileView', 'jquery', 'dubCommon' ], function(ProfileView, $, dubCommon) {
    $(function() {
        new ProfileView({
            'el': $('#profile')
        });
    });
});