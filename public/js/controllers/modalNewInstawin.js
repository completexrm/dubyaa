require([
	'/js/views/modals/NewInstawinView.js',
	'jquery'
],function(
	NewInstawinView,
	$
) {
    $(function() {
        if($('#modalNewInstawin').length) {
	        new NewInstawinView({
	            'el': $('#modalNewInstawin')
	        });
        }
    });
});