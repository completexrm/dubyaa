define(['underscore', 'backbone', 'moment', 'jqueryui', 'bootstrap', 'cookie', 'timepicker'], function(_, Backbone, moment){

  var HomeView = Backbone.View.extend({
    events: {
      'click .todo-tools a' : 'toggleToolTabs',
      'click .dubyaa-notwon' : 'doDubyaa',
      'click .undo-dubyaa' : 'undoDubyaa',
      'click #pickPoints:not(.won)' : 'pickPoints',
      'click #pickPoints.won' : 'killPickPoints',
      'click .new-todo' : 'addNewTodo',
      'click .torch-todo' : 'torchTodo',
      'click .torch-backlog-todo' : 'torchBacklogTodo',
      'click .delete-todo' : 'deleteTodo',
      'click .undelete-todo' : 'unDeleteTodo',
      'blur .todo-body textarea' : 'saveToDo',
      'blur .todo.mobile input.todo-item' : 'saveToDo',
      'click .picked-points' : 'doPickPoints',
      'change .points-mobile' : 'doMobilePoints',
      'click .tag-delete' : 'doDeleteTag',
      'keydown .add-tag' : 'doSaveTag',
      'change .date-pickers' : 'doChangeDateRange',
      'click .set-due-date' : 'doSetDueDate',
      'change .datepicker' : 'doSaveDueDate',
      'click .save-date' : 'doSaveDueDate',
      'click .show-tags' : 'doShowTags',
      'click .hide-tags' : 'doHideTags',
      'click .tag-text.off' : 'doTagFilter',
      'click .tag-text.on' : 'doKillTagFilter',
      'click #viewDubyaas:not(.active)' : 'viewDubyaas',
      'click #viewDubyaas.active' : 'hideDubyaas',
      'click #viewDeleted:not(.active)' : 'viewDeleted',
      'click #viewDeleted.active' : 'hideDeleted',
      'click #viewDelegated:not(.active)' : 'viewDelegated',
      'click #viewDelegated.active' : 'hideDelegated',
      'click .todo-comments > a' : 'loadTodoComments',
      'click .hide-dash' : 'doHideDash',
      'click .show-dash' : 'doShowDash',
      'click #doDelegate' : 'doDelegate',
      'click .delegate-todo' : 'setupDelegate',
      'show.bs.modal #todoDelegate' : 'populateDelegateList',
      // 'hidden.bs.modal #newInstawin' : 'loadTodos',
      'blur #editDueDateTime input' : 'doSaveDueDate',
      'click .backlog-to-list' : 'doBacklogConvert',
      'click .toggle-backlog' : 'doToggleBacklog',
      'click .new-backlog' : 'doSetupNewBacklogItem',
      'click .relegate-todo' : 'doSaveToBacklog'
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
      this.displayName = this.appData.attr('data-display-name'),
      this.maxOpen = this.appData.attr('data-maxopen'),
      this.multiplier = this.appData.attr('data-multiplier'),
      this.isFirstLogin = this.appData.attr('data-firstlogin');
      this.isMobile = this.appData.attr('data-is-mobile');
      this.loadTodos(); this.setupUI();
      this.noTodo = 'You have to put something to do first!';
      this.bottomHeight = 450;
      this.$hideDash = this.$el.find('.hide-dash');
      this.$showDash = this.$el.find('.show-dash');
      this.noEntryMessage = 'You have the maximum number of unfinished items!';
      if(Number(this.isFirstLogin)===1) {
        this.$el.find('#modalOnboard').modal('show');
      }
      $('html').on('click', function() {
        self.hidePoints();
      });
    },

    checkCanEnter : function() {
      var totalOpen = this.$el.find('.todo').not('.is-dubyaa').not('.backlog').length;
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
      // this.$el.find('#homeLeftTop').css({
      //   'height': tH + 'px',
      //   'overflow-y': 'auto',
      //   'overflow-x': 'visible'
      // });
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
      var isDelegated = ($('#viewDelegated').hasClass('active')) ? 1 : 0;
      this.setupTodos();
      this.loadBacklog();
      $.get(this.wsURL + '/Todo/FetchUser?userId='+this.userId+'&dateRange='+dateRange+'&dateRangeType='+dateRangeType+'&isDubyaa='+isDubyaa+'&isDeleted='+isDeleted+'&isDelegated='+isDelegated, function(data) {
        if(data.success===true) {
          var totalTodos = data.todos.length;
          var todoURL = (self.isMobile==='1') ? 'Mobile' : '';
          $.post('/todo/viewTodos' + todoURL, data.todos, function(todos) {
            self.yesTodos();
            self.$el.find('#todos').html(todos);
            self.checkCanEnter();
            self.setupJqueryUi();
            self.sizeDash();
          }, 'html');
        } else {
          self.noTodos();
        }
      }, 'json').fail(function() {
        self.checkNoContent();
      });
    },

    loadBacklog : function() {
      var self=this;
      $.get(this.wsURL + '/Todo/FetchUserBacklog?userId='+this.userId, function(data) {
        if(data.success===true) {
          var totalTodos = data.todos.length;
          var todoURL = (self.isMobile==='1') ? 'Mobile' : '';
          $.post('/todo/viewTodosBacklog' + todoURL, data.todos, function(todos) {
            var $bL = self.$el.find('#backlog');
            self.$el.find('#noBacklog').addClass('hide');
            $bL.find('#list').html(todos);
            $bL.removeClass('hide');
          }, 'html');
        } else {
          self.$el.find('#backlog').addClass('hide');
          self.$el.find('#noBacklog').removeClass('hide');
        }
      }, 'json');
    },

    checkNoContent : function() {
      var total = this.$el.find('.todo:visible').not('.backlog').length,
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
      this.$el.find('.no-todos').addClass('hide');
    },

    noTodos : function() {
      this.$el.find('#todos').html('');
      this.$el.find('#todoControls .notodo-hide').addClass('hide');
      this.$el.find('#todoCover').addClass('hide');
      if(this.$el.find('.dubyaa-filter.active').length > 0) {
        this.$el.find('#noTodos').addClass('hide');
        this.$el.find('#noTodosDubyaaDeleted').removeClass('hide');
      } else {
        this.$el.find('#noTodos').removeClass('hide');
        this.$el.find('#noTodosDubyaaDeleted').addClass('hide');
      }
    },

    yesTodos : function() {
      this.$el.find('#todoControls .notodo-hide').removeClass('hide');
      this.$el.find('#todoCover').addClass('hide');
      this.$el.find('#noTodos').addClass('hide');
      this.$el.find('.dubyaa-filter').removeClass('hide');
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
        .find('.date').focus();
    },

    doSaveDueDate : function(event) {
      var $e = $(event.currentTarget), todoId = $e.attr('data-id'),
      $todo = $('.todo[data-id="'+todoId+'"]'),
      dateDue = $todo.find('input.date').val(), self=this;
      d = {
        id: todoId,
        accountId: this.acctId,
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
        userId: this.userId,
        accountId: this.acctId
      };
      $.post(this.wsURL + '/Todo/DoDubyaa', d, function(data) {
        if(data.success) {
          if(self.isMobile==='0') {
            $e.addClass('dubyaa-won');
            $e.removeClass('dubyaa-notwon');
            $e.text($e.data('won-text'));
            $points.addClass('won');
            $todo.addClass('is-dubyaa');
            $text.attr('disabled', 'disabled');
          }
          self.stampTodo($todo);
          self.loadTodos();
        }
      }, 'json');
    },

    undoDubyaa : function(event) {
      var self=this, $e = $(event.currentTarget), 
      $todo = $e.closest('.todo'),
      id = $todo.data('id');
      if(!id) {
        alert('There is nothing to do!!!');
        return;
      }
      var d = {
        id: id,
        accountId: this.acctId,
        userId: this.userId
      };
      $.post(this.wsURL + '/Todo/DeleteDubyaa', d, function(data) {
        if(data.success) {
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

    doMobilePoints : function(event) {
      event.stopPropagation();
      var self=this, $e = $(event.currentTarget),
      $todo = $e.closest('.todo'),
      todoId = $todo.data('id'),
      points = $e.val()
      d = {
        id: todoId,
        accountId: this.acctId,
        userId: this.userId,
        points: points
      }
      $.post(this.wsURL + '/Todo/Update', d, function(data) {
        if(data.success) {
          self.stampTodo($todo);
        } else {
          alert('Sorry, there was a problem updating your points');
        }
      }, 'json');
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
        accountId: this.acctId,
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
        alert(this.noEntryMessage);
        return;
      }
      this.yesTodos();
      var newURL = (this.isMobile==='1') ? 'Mobile' : '';
      $.get('/todo/new' + newURL, function(todo) {
        self.$el.find('.no-todos').addClass('hide');
        $container.prepend(todo).find('.todo').first().find('textarea, input').focus();
        self.setupJqueryUi();
      }, 'html');
    },

    deleteTodo : function(event) {
      var self=this,$e = $(event.currentTarget), $todo = $e.closest('.todo'), todoId=$todo.attr('data-id');
      $todo.remove();
      if(typeof todoId !== 'undefined' && todoId !==null && Number(todoId) > 0) {
        var d = {
          id: todoId,
          accountId: this.acctId,
          userId: this.userId
        }
        $.post(this.wsURL + '/Todo/Delete', d, function(data) {
          self.checkNoContent();
          self.checkCanEnter();
        },'json');
      }
      self.checkNoContent();
      self.checkCanEnter();
    },

    torchTodo : function(event) {
      var self=this,$e = $(event.currentTarget), $todo = $e.closest('.todo'), todoId=$todo.attr('data-id');
      var d = { id: todoId };
      if(confirm('This cannot be undone...')) {
        $.post(this.wsURL + '/Todo/Torch', d, function(data) {
          $todo.remove();
          self.loadTodos();
        },'json');
      }
    },

    torchBacklogTodo : function(event) {
      var self=this,$e = $(event.currentTarget), $todo = $e.closest('.todo');
      $todo.remove();
      this.loadBacklog();
    },

    unDeleteTodo : function(event) {
      var self=this,$e = $(event.currentTarget), $todo = $e.closest('.todo'), todoId=$todo.attr('data-id');
      var d = {
        id: todoId,
        accountId: this.acctId,
        userId: this.userId
      }
      $.post(this.wsURL + '/Todo/Undelete', d, function(data) {
        $todo.remove();
        self.checkNoContent();
        self.checkCanEnter();
      },'json');
    },

    saveToDo : function(event) {
      var self=this,$e = $(event.currentTarget),
      $todo = $e.closest('.todo'),
      todoId = $todo.attr('data-id'),
      dateDue = $todo.find('.date').val(),
      label = $e.val(),
      currentValue = $e.attr('data-current');
      
      // Something has changed
      if(label!==currentValue && label!=='') {
        if(todoId)
        {
          var d = {
            id: todoId,
            accountId: this.acctId,
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
            accountId: this.acctId,
            label: label,
            dateDue: dateDue
          }
          d.isBacklog = 0;
          if($todo.hasClass('backlog')) {
            d.isBacklog = 1
          }
          this.$el.find('.faux-container').remove();
          $.post(this.wsURL + '/Todo/Create', d, function(data) {
            if(data.success) {
              $todo.attr('data-id', data.todoId).find('.needs-id').attr('data-id', data.todoId);
              $e.attr('data-current', label);
              self.stampTodo($todo);
              self.checkCanEnter();
              if($todo.hasClass('backlog')) {
                self.loadBacklog();
              }
            } else {
              alert('Could not save your To-do!');
            }
          }, 'json');
        }
        $todo.find('.mobile-low').removeClass('hide');
        $todo.find('.post-save-show').removeClass('hide');
      } else {
        if(label==='' && todoId) {
          alert('You need something here');
          $e.focus();
        }
      }
    },

    viewDubyaas : function(event) {
      var $e=$(event.currentTarget);
      this.$el.find('.dubyaa-filter').removeClass('active').addClass('outline');
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
      this.$el.find('.dubyaa-filter').removeClass('active').addClass('outline');
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

    viewDelegated : function(event) {
      var $e=$(event.currentTarget);
      this.$el.find('.dubyaa-filter').removeClass('active').addClass('outline');
      $e.addClass('active');
      $e.removeClass('outline');
      this.loadTodos();
    },

    hideDelegated : function(event) {
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
        accountId: this.acctId,
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
          accountId: this.acctId,
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
    },

    setupDelegate : function(event) {
      var $e = $(event.currentTarget), todoId = $e.attr('data-id');
      $('#todoDelegate').find('#todoId').val(todoId);
    }    ,

    populateDelegateList : function(event) {
      var self=this, $modal = $('#todoDelegate'), $list = $modal.find('#userId');
      $.get(this.wsURL + '/Account/FetchUsers?accountId=' + this.acctId, function(data) {
        $.each(data.users, function(i, v) {
          if(v.id !== self.userId) {
            $list.append('<option value="' + v.id + '">' + v.displayName + '</option>')
          }
        });
      }, 'json');
    },

    doDelegate : function(event) {
      var self=this, $modal=$('#todoDelegate'),
      todoId = $modal.find('#todoId').val(),
      userId = $('#todoDelegate').find('#userId').val(),
      d = {
        id: todoId,
        delegatorId: this.userId,
        accountId: this.acctId,
        delegatorName: this.displayName,
        userId: userId
      };
      $.post(this.wsURL + '/Todo/Delegate', d, function(data) {
        if(data.success) {
          $modal.modal('hide');
          self.loadTodos();
          $.post(self.wsURL + '/Email/DelegateNotify', d);
        } else {
          alert('Sorry, we can\'t delegate this right now');
        }
      }, 'json');
    },

    doBacklogConvert : function(event) {
      var self=this;
      var d = {
        id: $(event.currentTarget).attr('data-id'),
        userId: this.userId,
        accountId: this.acctId
      };
      if(this.appData.attr('data-canenter')==='true') {
        $.post(this.wsURL + '/Todo/BacklogConvert', d, function(data) {
          if(data.success) {
            self.loadTodos();
          }
        }, 'json');
      } else {
        alert(this.noEntryMessage);
      }
    },

    doToggleBacklog : function(event) {
      var $e = $(event.currentTarget);
      $e.find('.toggle-direction').toggleClass('hide');
      $e.next('.backlog-list').slideToggle('fast');
    },

    doSetupNewBacklogItem : function(event) {
      var self=this;
      $.get('/todo/newBacklog', function(html) {
        self.$el.find('#noBacklog').addClass('hide');
        self.$el.find('#backlog #loader').addClass('hide');
        self.$el.find('#backlog')
          .removeClass('hide')
          .find('#list').prepend(html)
            .find('input').focus();
      }, 'html');
    },

    doSaveToBacklog : function(event) {
      var canEnter = this.appData.attr('data-canenter'),
      self=this, $e = $(event.currentTarget), id = $e.attr('data-id'), 
      d = {
        accountId: this.acctId,
        userId: this.userId,
        id: id
      };
      $.post(this.wsURL + '/Todo/SaveToBacklog', d, function(data) {
        if(data.success) {
          self.loadTodos();
        } else {
          // TODO: error handling
        }
      }, 'json');
    }

  });

  return HomeView;

});