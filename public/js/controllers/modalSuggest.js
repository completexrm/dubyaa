require([
	'/js/views/modals/NewSuggestion.js',
	'jquery'
],function(
	NewSuggestionView,
	$
) {
    $(function() {
        if($('#modalNewSuggestion').length) {
	        new NewSuggestionView({
	            'el': $('#modalNewSuggestion')
	        });
        }
    });
});