require([ 'js/views/activity/ActivityView', 'jquery', 'dubCommon' ], function(ActivityView, $, dubCommon) {
    $(function() {
        new ActivityView({
            'el': $('#activity')
        });
    });
});