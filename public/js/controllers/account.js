require([
	'js/views/account/AccountView',
	'jquery', 
	'dubCommon', 
	'modalUser', 
	'modalTeam', 
	'modalLevel', 
	'onboard'
], function(AccountView, $, dubCommon) {
    $(function() {
        new AccountView({
            'el': $('#account')
        });
    });
});