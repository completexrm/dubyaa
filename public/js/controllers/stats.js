require([ 'js/views/stats/StatsView', 'js/views/home/ScoreView', 'jquery', 'dubCommon' ], function(StatsView, ScoreView, $, dubCommon) {
    $(function() {
        new StatsView({
            'el': $('#primary')
        });
        new ScoreView({
            'el': $('#productivityScore')
        });
    });
});