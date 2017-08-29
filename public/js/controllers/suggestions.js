require([
	'js/views/suggestions/SuggestionsView', 
	'jquery', 
	'dubCommon',
	'modalSuggest'
], function(SuggestionsView, $) {
    $(function() {
        new SuggestionsView({
            'el': $('#suggestions')
        });
    });
});