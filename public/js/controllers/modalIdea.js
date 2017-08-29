require([
	'/js/views/modals/NewIdea.js',
	'jquery'
],function(
	NewIdeaView,
	$
) {
    $(function() {
        if($('#modalNewIdea').length) {
	        new NewIdeaView({
	            'el': $('#modalNewIdea')
	        });
        }
    });
});