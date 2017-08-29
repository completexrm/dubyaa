require([
	'/js/views/modals/NewTeamView.js',
	'/js/views/modals/EditTeamView.js',
	'/js/views/modals/ChangeTeamLeadView.js',
	'/js/views/modals/ChangeTeam.js',
	'jquery'
],function(
	NewTeamView,
	EditTeamView,
	ChangeTeamLeadView,
	ChangeTeamView,
	$
) {
    $(function() {
        if($('#modalNewTeam').length) {
	        new NewTeamView({
	            'el': $('#modalNewTeam')
	        });
        }
        if($('#modalEditTeam').length) {
	        new EditTeamView({
	            'el': $('#modalEditTeam')
	        });
        }
        if($('#modalChangeTeamLead').length) {
	        new ChangeTeamLeadView({
	            'el': $('#modalChangeTeamLead')
	        });
        }
        if($('#modalChangeTeam').length) {
	        new ChangeTeamView({
	            'el': $('#modalChangeTeam')
	        });
        }
    });
});