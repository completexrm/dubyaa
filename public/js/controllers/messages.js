require([ 'js/views/messages/MessagesView', 'jquery', 'dubCommon' ], function(MessagesView, $, dubCommon) {
    $(function() {
        new MessagesView({
            'el': $('#messages')
        });
    });
});