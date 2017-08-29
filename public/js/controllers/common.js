require([ 'js/views/common/CommonView', 'jquery' ], function(CommonView, $) {
    $(function() {
        new CommonView({
            'el': $('#content')
        });
    });
});