exports.stepZero =  function(req, res){
    res.render('partials/overlay/welcome');
};

exports.stepOne =  function(req, res){
    res.render('partials/overlay/whatIsAWin');
};

exports.stepTwo =  function(req, res){
    res.render('partials/overlay/newWin');
};

exports.stepThree =  function(req, res){
    res.render('partials/overlay/winFilters');
};

exports.stepFour =  function(req, res){
    res.render('partials/overlay/ambitions');
};

exports.stepFive =  function(req, res){
    res.render('partials/overlay/finish');
};