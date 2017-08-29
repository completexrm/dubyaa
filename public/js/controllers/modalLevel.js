require([
	'/js/views/modals/NewLevelView.js',
	'/js/views/modals/EditLevelView.js',
	'jquery'
],function(
	NewLevelView,
	EditLevelView,
	$
) {
    $(function() {
        if($('#modalNewLevel').length) {
	        new NewLevelView({
	            'el': $('#modalNewLevel')
	        });
        }
        if($('#modalEditLevel').length) {
	        new EditLevelView({
	            'el': $('#modalEditLevel')
	        });
        }
    });
});