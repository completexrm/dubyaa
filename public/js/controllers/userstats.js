require([ '/js/views/stats/UserView.js', 'jquery', '/js/views/common/CommonView.js', '/libs/chartjs/Chart.min.js'], function(UserView, $, dubCommon, Chart) {
    $(function() {
        new UserView({
            'el': $('#userStats')
        });
    });
});