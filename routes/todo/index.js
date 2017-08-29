var moment = require('moment');

exports.new =  function(req, res){
    res.render('partials/todo', {
    	todo: {
    		id: '',
    		label: '',
    		isDubyaa: '',
    		points: '',
            delegatorId: 0,
            updatedOn: '',
            isDeleted: 0
    	}
    });
};

exports.newMobile =  function(req, res){
    res.render('partials/todoMobile', {
        todo: {
            id: '',
            label: '',
            isDubyaa: '',
            points: '',
            updatedOn: '',
            isNew: true
        }
    });
};

exports.newBacklog =  function(req, res){
    res.render('partials/todoMobileBacklog', {
        todo: {
            id: '',
            label: '',
            isDubyaa: '',
            points: '',
            updatedOn: '',
            isNew: true
        }
    });
};

exports.viewTodos = function(req, res) {
	res.render('partials/viewTodos', {
		todos:  req.body,
        isMobile: false
	});
};

exports.viewTodosBacklog = function(req, res) {
    res.render('partials/viewTodosBacklog', {
        todos:  req.body,
        isMobile: true
    });
};

exports.viewTodosBacklogMobile = function(req, res) {
    res.render('partials/viewTodosBacklog', {
        todos:  req.body,
        isMobile: true
    });
};

exports.viewTodosMobile = function(req, res) {
    res.render('partials/viewTodos', {
        todos:  req.body,
        isMobile: true
    });
};

exports.loadComments = function(req, res) {
    res.render('partials/todoComments', {
        comments:  req.body
    });
};

exports.viewPointsMonth = function(req, res) {
    res.render('partials/viewPointsMonth', {
        month: req.body
    });
};

exports.viewPointsQuarter = function(req, res) {
    res.render('partials/viewPointsQuarter', {
        quarter: req.body
    });
};

exports.viewPointsYear = function(req, res) {
    res.render('partials/viewPointsYear', {
        year: req.body
    });
};

exports.viewTags = function(req, res) {
    res.render('partials/viewTags', {
        tags:  req.body.tags,
        todo: {
            id: req.body.id
        }
    });
};

exports.listUserPopularTags = function(req, res) {
    res.render('home/popularTags', {
        tags:  req.body
    });
};
