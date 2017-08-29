require([
	'/js/views/modals/OnboardView.js',
	'jquery'
],function(
	OnboardView,
	$
) {
    $(function() {
        if($('#modalOnboard').length) {
	        new OnboardView({
	            'el': $('#modalOnboard')
	        });
        }
    });
});