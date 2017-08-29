define(['underscore', 'backbone', 'moment', 'jqueryui', 'bootstrap', 'cookie', 'timepicker'], function(_, Backbone, moment){

  var LeftView = Backbone.View.extend({
    events: {
      'click .todo-tools a' : 'toggleToolTabs',
      'click .dubyaa-notwon' : 'doDubyaa',
      'click .dubyaa-won' : 'undoDubyaa',
      'click #pickPoints:not(.won)' : 'pickPoints',
      'click #pickPoints.won' : 'killPickPoints',
      'click .new-todo' : 'addNewTodo',
      'click .torch-todo' : 'torchTodo',
      'click .delete-todo' : 'deleteTodo',
      'click .undelete-todo' : 'unDeleteTodo',
      'blur .todo-body textarea' : 'saveToDo',
      'click .picked-points' : 'doPickPoints',
      'click .tag-delete' : 'doDeleteTag',
      'keydown .add-tag' : 'doSaveTag',
      'change .date-pickers' : 'doChangeDateRange',
      'click .set-due-date' : 'doSetDueDate',
      'change .datepicker' : 'doSaveDueDate',
      'click .show-tags' : 'doShowTags',
      'click .hide-tags' : 'doHideTags',
      'click .tag-text.off' : 'doTagFilter',
      'click .tag-text.on' : 'doKillTagFilter',
      'click #viewDubyaas:not(.active)' : 'viewDubyaas',
      'click #viewDubyaas.active' : 'hideDubyaas',
      'click #viewDeleted:not(.active)' : 'viewDeleted',
      'click #viewDeleted.active' : 'hideDeleted',
      'click .todo-comments > a' : 'loadTodoComments',
      'click .hide-dash' : 'doHideDash',
      'click .show-dash' : 'doShowDash'
    },

    initialize : function() {
      // kill ajax caching
      $.ajaxSetup({ cache: false });
      var self = this;
      
      $(window).on('resize', function() {
        self.sizeDash();
      });

      // setup some variables
      this.wsURL = $('body').data('wsurl');
      this.$right = this.$el.find('#homeRight');
      this.appData = this.$el.find('#appData'), this.userId = this.appData.attr('data-userid'),
      this.acctId = this.appData.attr('data-acctid'),
      this.maxOpen = this.appData.attr('data-maxopen'),
      this.multiplier = this.appData.attr('data-multiplier'),
      this.isFirstLogin = this.appData.attr('data-firstlogin');
      this.loadTodos(); this.setupUI();
      this.noTodo = 'You have to put something to do first!';
      this.bottomHeight = 450;
      this.$hideDash = this.$el.find('.hide-dash');
      this.$showDash = this.$el.find('.show-dash');
      if(Number(this.isFirstLogin)===1) {
        this.$el.find('#modalOnboard').modal('show');
      }
      $('html').on('click', function() {
        self.hidePoints();
      });
      $('.modal').on('hidden.bs.modal', function (e) {
        self.fetchPoints();
      })
    },

    checkCanEnter : function() {
      var totalOpen = this.$el.find('.todo').not('.is-dubyaa').length;
      if(totalOpen < this.maxOpen) {
        this.appData.attr('data-canenter', 'true');
      } else {
        this.appData.attr('data-canenter', 'false');
      }
    },

    setupJqueryUi : function() {
      $('[data-toggle="tooltip"]').tooltip();
      this.$el.find('.datepicker').each(function() {
        $(this).datepicker();
      });
      $('.timepicker').timepicker({
        'scrollDefault': 'now'
      });
    },

    setupUI : function() {
      this.$el.find('#dateRange option')
        .removeAttr('checked')
        .find('option[value="'+$.cookie('dubyaaDateRange')+'"]').attr('checked', 'checked');
      this.$el.find('#dateRangeType option')
        .removeAttr('checked')
        .find('option[value="'+$.cookie('dubyaaDateRangeType')+'"]').attr('checked', 'checked');
      this.sizeDash();
    },

    sizeDash : function() {
      // Define necessary elements
      var $hLB = this.$el.find('#homeLeftBottom'), 
      $hR = this.$el.find('#homeRight'), 
      $showDash = $('#showDash'), 
      
      wH = $(window).outerHeight(), 
      hH = $('#header').outerHeight(true), 
      aH = parseInt(wH-hH, 10), 
      bH = ($hLB.attr('data-hide')==='false') ? 84 : 0, 
      tH = parseInt(aH - bH, 10);
      this.$el.find('#homeLeftTop').css({
        'height': tH + 'px',
        'overflow-y': 'auto',
        'overflow-x': 'visible'
      });
    },

    doChangeDateRange : function(event) {
      var dateRange = this.$el.find('#dateRange').val();
      var dateRangeType = this.$el.find('#dateRangeType').val();
      $.cookie('dubyaaDateRange', dateRange);
      $.cookie('dubyaaDateRangeType', dateRangeType);
      this.loadTodos();
    },

    loadTodos : function() {
      var self=this, 
      dateRange=$.cookie('dubyaaDateRange');
      dateRangeType=$.cookie('dubyaaDateRangeType');
      var isDubyaa = ($('#viewDubyaas').hasClass('active')) ? 1 : 0;
      var isDeleted = ($('#viewDeleted').hasClass('active')) ? 1 : 0;
      this.setupTodos();
      self.fetchPoints();
      $.get(this.wsURL + '/Todo/FetchUser?userId='+this.userId+'&dateRange='+dateRange+'&dateRangeType='+dateRangeType+'&isDubyaa='+isDubyaa+'&isDeleted='+isDeleted, function(data) {
        if(data.success===true) {
          var totalTodos = data.todos.length;
          $.post('/todo/viewTodos', data.todos, function(todos) {
            self.yesTodos();
            self.$el.find('#todos').html(todos);
            self.checkCanEnter();
            self.setupJqueryUi();
            self.sizeDash();
            // if(self.$el.find('.dubyaa-filter.active').length>0) {
            //   self.$el.find('.item-count > span.number').text(totalTodos);
            //   self.$el.find('.item-count').removeClass('hide');
            // } else {
            //   self.$el.find('.item-count').addClass('hide');
            // }
          }, 'html');
        } else {
          self.noTodos();
        }
      }, 'json').fail(function() {
        self.checkNoContent();
      });
    },

    checkNoContent : function() {
      var total = this.$el.find('.todo:visible').length,
      $msg = this.$el.find('#noTodos');
      if(total===0) {
        this.noTodos();
      } else {
        this.yesTodos();
      }
    },

    setupTodos : function() {
      this.$el.find('.show-tags').removeClass('hide');
      this.$el.find('.hide-tags').addClass('hide');
      // this.$el.find('#todos').html('');
      this.$el.find('#todoLoading').addClass('hide');
      this.$el.find('#todoCover').removeClass('hide');
      this.$el.find('#noTodos').addClass('hide');
    },

    noTodos : function() {
      this.$el.find('#todos').html('');
      this.$el.find('#todoControls .notodo-hide').addClass('hide');
      this.$el.find('#todoCover').addClass('hide');
      this.$el.find('#noTodos').removeClass('hide');
    },

    yesTodos : function() {
      this.$el.find('#todoControls .notodo-hide').removeClass('hide');
      this.$el.find('#todoCover').addClass('hide');
      this.$el.find('#noTodos').addClass('hide');
    },

    hidePoints : function() {
      
      this.$el.find('.points-selector').addClass('hide');
    },

    toggleToolTabs : function(event) {
      var $e = $(event.currentTarget), $li=$e.parent(), 
      $list=$e.closest('ul'), target = $e.data('target'), $todo = $list.closest('.todo'), todoId = $todo.attr('data-id');
      if(!todoId) {
        alert(this.noTodo);
        return;
      }
      $list.find('li').removeClass('active');
      $li.addClass('active');
      $todo.find('.toggleable').addClass('hide');
      $todo.find('#'+target).removeClass('hide');
    },

    doSetDueDate : function(event) {
      var $e = $(event.currentTarget), todoId = $e.attr('data-id'),
      $display = $e.closest('#displayDueDateTime'),
      $edit = $display.next('#editDueDateTime');
      if(!todoId) {
        alert(this.noTodo);
        return;
      }
      $display.addClass('hide');
      $edit
        .removeClass('hide')
        .find('.datepicker').focus();
    },

    doSaveDueDate : function(event) {
      var $e = $(event.currentTarget), todoId = $e.attr('data-id'),
      $todo = $('.todo[data-id="'+todoId+'"]'),
      dateDue = $todo.find('input.datepicker.date').val(), self=this;
      d = {
        id: todoId,
        userId: this.userId,
        dateDue: dateDue,
        multiplier: this.multiplier
      };
      $.post(this.wsURL + '/Todo/SetDueDate', d, function(data) {
        self.loadTodos();
      }, 'json');
    },

    doDubyaa : function(event) {
      var self=this,$e = $(event.currentTarget), 
      $points = $e.prev().find('#pickPoints'),
      $todo = $e.closest('.todo'),
      $text = $todo.find('textarea'),
      id = $todo.data('id');
      if(!id) {
        alert(this.noTodo);
        return;
      }
      var d = {
        id: id,
        userId: this.userId
      };
      $.post(this.wsURL + '/Todo/DoDubyaa', d, function(data) {
        if(data.success) {
          $e.addClass('dubyaa-won');
          $e.removeClass('dubyaa-notwon');
          $e.text($e.data('won-text'));
          $points.addClass('won');
          $todo.addClass('is-dubyaa');
          $text.attr('disabled', 'disabled');
          self.stampTodo($todo);
          self.fetchPoints();
          self.loadTodos();
        }
      }, 'json');
    },

    undoDubyaa : function(event) {
      var self=this, $e = $(event.currentTarget), 
      $points = $e.prev().find('#pickPoints'),
      $todo = $e.closest('.todo'),
      $text = $todo.find('textarea'),
      id = $todo.data('id');
      if(!id) {
        alert('There is nothing to do!!!');
        return;
      }
      var d = {
        id: id,
        userId: this.userId
      };
      $.post(this.wsURL + '/Todo/DeleteDubyaa', d, function(data) {
        if(data.success) {
          $e.removeClass('dubyaa-won');
          $e.addClass('dubyaa-notwon');
          $todo.removeClass('is-dubyaa');
          $e.text($e.data('orginal-text'));
          $points.removeClass('won');
          $text.removeAttr('disabled');
          self.stampTodo($todo);
          self.fetchPoints();
          self.loadTodos();
        }
      }, 'json');
    },

    pickPoints : function(event) {
      event.stopPropagation();
      var $e = $(event.currentTarget), $list = $e.next('.points-selector');
      $list.toggleClass('hide');
      $e.toggleClass('open');
    },

    doPickPoints : function(event) {
      var self=this,$e = $(event.currentTarget),
      $todo = $e.closest('.todo'),
      todoId = $todo.data('id'),
      points = $e.data('points'),
      $list = $e.closest('ul'),
      $tag = $list.prev('#pickPoints').find('.selected-points');
      
      if(!todoId) {
        alert(this.noTodo);
        return;
      }

      $list.find('li').removeClass('selected');
      $e.parent('li').addClass('selected');

      var ptsTag = (points===1) ? points + ' pt' : points + ' pts';
      var d = {
        id: todoId,
        userId: this.userId,
        points: points
      }
      $.post(this.wsURL + '/Todo/Update', d, function(data) {
        if(data.success) {
          self.stampTodo($todo);
          $tag.text(ptsTag);
          // self.loadTodos();
        } else {
          alert('Sorry, there was a problem updating your points');
        }
      }, 'json');
    },

    killPickPoints : function() {
      alert('Sorry, you have already won this!');
    },

    addNewTodo : function() {
      var self=this, $container = this.$el.find('#todos'),
      canEnter = this.appData.attr('data-canenter');
      if(canEnter==='false') {
        alert('You have the maximum number of unfinished items!');
        return;
      }
      this.yesTodos();
      $.get('/todo/new', function(todo) {
        self.$el.find('#noTodos').addClass('hide');
        $container.prepend(todo).find('.todo').first().find('textarea').focus();
        self.setupJqueryUi();
      }, 'html');
    },

    deleteTodo : function(event) {
      var self=this,$e = $(event.currentTarget), $todo = $e.closest('.todo'), todoId=$todo.attr('data-id');
      $todo.remove();
      if(typeof todoId !== 'undefined' && todoId !==null && Number(todoId) > 0) {
        var d = {
          id: todoId,
          userId: this.userId
        }
        $.post(this.wsURL + '/Todo/Delete', d, function(data) {
          self.checkNoContent();
          self.fetchPoints();
          self.checkCanEnter();
        },'json');
      }
      self.checkNoContent();
      self.fetchPoints();
      self.checkCanEnter();
    },

    torchTodo : function(event) {
      var self=this,$e = $(event.currentTarget), $todo = $e.closest('.todo'), todoId=$todo.attr('data-id');
      var d = { id: todoId };
      if(confirm('Are you sure? This cannot be undone...')) {
        $.post(this.wsURL + '/Todo/Torch', d, function(data) {
          $todo.remove();
          self.checkNoContent();
          self.fetchPoints();
          self.checkCanEnter();
        },'json');
      }
    },

    unDeleteTodo : function(event) {
      var self=this,$e = $(event.currentTarget), $todo = $e.closest('.todo'), todoId=$todo.attr('data-id');
      var d = {
        id: todoId,
        userId: this.userId
      }
      $.post(this.wsURL + '/Todo/Undelete', d, function(data) {
        $todo.remove();
        self.checkNoContent();
        self.fetchPoints();
        self.checkCanEnter();
      },'json');
    },

    saveToDo : function(event) {
      var self=this,$e = $(event.currentTarget),
      $todo = $e.closest('.todo'),
      todoId = $todo.attr('data-id'),
      label = $e.val(),
      currentValue = $e.attr('data-current');
      
      // Something has changed
      if(label!==currentValue && label!=='') {
        if(todoId)
        {
          var d = {
            id: todoId,
            userId: this.userId,
            label: label
          }
          $.post(this.wsURL + '/Todo/Update', d, function(data) {
            if(data.success) {
              self.stampTodo($todo);
              $e.attr('data-current', label)
            } else {
              alert('Could not save your To-do!');
            }
          }, 'json');
        } else {
          var d = {
            userId: this.userId,
            label: label
          }
          $.post(this.wsURL + '/Todo/Create', d, function(data) {
            if(data.success) {
              $todo.attr('data-id', data.todoId).find('.needs-id').attr('data-id', data.todoId);
              $e.attr('data-current', label);
              self.stampTodo($todo);
              self.checkCanEnter();
            } else {
              alert('Could not save your To-do!');
            }
          }, 'json');
        }
      } else {
        if(label==='' && todoId) {
          alert('You need something here');
          $e.focus();
        }
      }
    },

    viewDubyaas : function(event) {
      var $e=$(event.currentTarget);
      $e.addClass('active');
      $e.removeClass('outline');
      this.loadTodos();
    },

    hideDubyaas : function(event) {
      var $e=$(event.currentTarget);
      $e.removeClass('active');
      $e.addClass('outline');
      this.loadTodos();
    },

    viewDeleted : function(event) {
      var $e=$(event.currentTarget);
      $e.addClass('active');
      $e.removeClass('outline');
      this.loadTodos();
    },

    hideDeleted : function(event) {
      var $e=$(event.currentTarget);
      $e.removeClass('active');
      $e.addClass('outline');
      this.loadTodos();
    },

    stampTodo : function($todo) {
      var date = moment().format('MMMM Do YYYY, h:mm:ss a');
      $todo.find('.saved-tag .date').text('Saved ' + date);
    },

    doDeleteTag : function(event) {
      var $e = $(event.currentTarget).parent('.tag'),
      d = {
        userId: this.userId,
        tagId: $e.attr('data-tag-id'),
        id: $e.attr('data-todo-id')
      }
      $.post(this.wsURL + '/Todo/DeleteTag', d, function(data) {
        if(data.success) {
          $e.remove();
        } else {
          alert('Could not remove this tag');
        }
      }, 'json');
    },

    doSaveTag : function(event) {
      var self=this,$e = $(event.currentTarget), tag = $e.val(), 
      $todo = $e.closest('.todo'), todoId = $todo.attr('data-id'),
      $tags = $todo.find('.tags'),
      code = (event.which) ? event.which : event.keyCode;
      if(code===13 && tag !== '') {
        var d = {
          userId: this.userId,
          tag: tag,
          id: todoId
        }
        $.post(this.wsURL + '/Todo/CreateTag', d, function(data) {
          if(data.success) {
            var fetch = {
              tags: data.tags,
              id: todoId
            }
            $.post('/todo/viewTags', fetch, function(tags) {
              $tags.html(tags);
            }, 'html');
            $e.val('');
            self.stampTodo($todo);
          }
        }, 'json');
      }
    },

    fetchPoints : function(event) {
      var self = this, $goalModal = $('#manageGoals');
      $.get(this.wsURL + '/Report/UserPoints?userId='+this.userId, function(data) {
        var points = data.points;
        $.post('/todo/viewPointsMonth', points.month, function(data) {
          self.$el.find('#pointsMonth').html(data);
        }, 'html');
        $.post('/todo/viewPointsQuarter', points.quarter, function(data) {
          self.$el.find('#pointsQuarter').html(data);
        }, 'html');
        $.post('/todo/viewPointsYear', points.year, function(data) {
          self.$el.find('#pointsYear').html(data);
        }, 'html');
        if(points.year.goalId) {
          $goalModal.find('#goalYear .goal-slide-tag')
            .attr('data-id', points.year.goalId)
            .val(points.year.goal);
        }
        if(points.quarter.goalId) {
          $goalModal.find('#goalQuarter .goal-slide-tag')
            .attr('data-id', points.quarter.goalId)
            .val(points.quarter.goal);
        }
        if(points.month.goalId) {
          $goalModal.find('#goalMonth .goal-slide-tag')
            .attr('data-id', points.month.goalId)
            .removeAttr('readonly')
            .val(points.month.goal)
        }
      }, 'json');
    },

    loadTodoComments : function(event) {
      var self=this, $e = $(event.currentTarget), isLoaded = $e.data('loaded'), id = $e.data('id'), $todo = $e.closest('.todo');
      var d = { id: id };
      if(!isLoaded) {
        $.get(this.wsURL + '/Todo/FetchTodoComments?id='+id, function(data) {
          if(data.success===true) {
            $.post('/todo/loadComments', data.comments, function(comments) {
              $todo.find('#todoComments').html(comments);
            }, 'html');
          }
        }, 'json');
        $e.attr('data-loaded', true);
      }
    },

    doShowTags : function(event) {
      var $e = $(event.currentTarget), $hideTags = $e.next('a.hide-tags');
      $e.addClass('hide'); $hideTags.removeClass('hide');
      this.$el.find('.todo-tag a').trigger('click');
    },

    doHideTags : function(event) {
      var $e = $(event.currentTarget), $showTags = $e.prev('a.show-tags');
      $e.addClass('hide'); $showTags.removeClass('hide');
      this.$el.find('.todo-edit a').trigger('click');
    },

    doTagFilter : function(event) {
      var $e = $(event.currentTarget), tag = $e.text();
      this.$el.find('.tag-text[data-tag="' + tag + '"]')
        .addClass('on')
        .removeClass('off');
      this.filterTodoTag();
    },

    doKillTagFilter : function(event) {
      var $e = $(event.currentTarget), tag = $e.text();
      this.$el.find('.tag-text[data-tag="' + tag + '"]')
        .removeClass('on')
        .addClass('off');
      this.filterTodoTag();
    },

    filterTodoTag : function() {
      if(this.$el.find('.tag-text.on').length) {
        this.$el.find('.todo').each(function() {
          var $t = $(this);
          if($t.find('.tag-text.on').length) {
            $t.removeClass('hide');
          } else {
            $t.addClass('hide');
          }
        });
      } else {
        $('.todo').removeClass('hide');
      }
    },

    doHideDash : function(event) {
      var $e = $(event.currentTarget), $hLB = this.$el.find('#homeLeftBottom'),
      hLBOffsetTop = $hLB.offset().top,
      hLBH = $hLB.outerHeight(true),
      hH = $('#header').outerHeight(true);
      $e.addClass('hide');
      this.$showDash.removeClass('hide');
      $hLB.addClass('hide');
      $hLB.attr('data-hide', 'true');
    },

    doShowDash : function(event) {
      var $e = $(event.currentTarget);
      $e.addClass('hide');
      this.$hideDash.removeClass('hide');
      $hLB = this.$el.find('#homeLeftBottom');
      $hLB.attr('data-hide', false);
      $hLB.removeClass('hide');
    }

  });

  return LeftView;

});