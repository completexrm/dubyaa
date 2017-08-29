require([
	'/js/views/modals/SetGoalView.js',
	'jquery'
],function(
	SetGoalView,
	$
) {
    $(function() {
        if($('#modalSetGoal').length) {
	        new SetGoalView({
	            'el': $('#modalSetGoal')
	        });
        }
    });
});