require([ 
	'js/views/teams/TeamsView', 
	'jquery', 
	'dubCommon',
	'modalSuggest'
], 
function(TeamsView, $) {
    $(function() {
        new TeamsView({
            'el': $('#teams')
        });
    });
});