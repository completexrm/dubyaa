require([
	'js/views/home/HomeView',
	// 'js/views/home/ScoreView', 
    'js/views/home/ActivityView', 
    'js/views/home/OverlayView', 
	'jquery', 
	'dubCommon', 
	'setGoal', 
	'onboard',
    'instawin',
], function(HomeView, ActivityView, OverlayView, $, dubCommon) {
    $(function() {
        new HomeView({
            'el': $('#home')
        });
        // new ScoreView({
        //     'el': $('#productivityScore')
        // });
        new ActivityView({
            'el': $('#activity')
        });
        new OverlayView({
            'el': $('body')
        });
    });
});