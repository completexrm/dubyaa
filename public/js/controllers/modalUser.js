require([
	'/js/views/modals/NewUserView.js',
	'/js/views/modals/EditUserView.js',
	'jquery'
],function(
	NewUserView,
	EditUserView,
	$
) {
    $(function() {
        if($('#modalNewUser').length) {
	        new NewUserView({
	            'el': $('#modalNewUser')
	        });
        }
        if($('#modalEditUser').length) {
	        new EditUserView({
	            'el': $('#modalEditUser')
	        });
        }
    });
});