require([ 
	'js/views/ideacloud/IdeaCloudView', 
	'jquery', 
	'modalIdea', 
	'dubCommon' 
], 
function(IdeaCloudView, $, dubCommon) {
    $(function() {
        new IdeaCloudView({
            'el': $('#ideaCloud')
        });
    });
});