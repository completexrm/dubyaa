define(['underscore', 'backbone', 'moment', 'jqueryui', 'bootstrap', 'cookie'], function(_, Backbone, moment){

  var OverlayView = Backbone.View.extend({
    events: {
      'click .close' : 'skipOverlays',
      'click .next' : 'nextOverlay',
      'click .skip' : 'skipOverlays'
    },

    initialize : function() {
      

      // kill ajax caching
      $.ajaxSetup({ cache: false });
      var self = this;
      
      // setup some variables
      this.wsURL = $('body').data('wsurl');
      this.appData = $('#appData'), this.userId = this.appData.attr('data-userid'),
      this.acctId = this.appData.attr('data-acctid');
      this.appHints = this.appData.attr('data-app-hints');
      this.setup();

    },

    setup : function() {
      if(Number(this.appHints)===1) {
        // this.setupOverlayBG();
        // var self=this;
        // setTimeout(function() {
        //   var step='stepZero', $anchor='stepZero';
        //   self.doOverlay($anchor, step);
        // }, 1000);
      }
    },

    nextOverlay : function(event) {
      var $e = $(event.currentTarget), 
      step=$e.data('next');
      if($e.data('next-elem')!=='step-five') {
        var $anchor=$('[data-overlay="' + $e.data('next-elem') + '"]');
      } else {
        var $anchor='stepFive';
      }
      $e.closest('.overlay-element').fadeOut();
      this.doOverlay($anchor, step);
    },

    doOverlay : function($anchor, step) {
      var self=this;
      $.get('/overlay/' + step, function(data) {
        $('body').append(data);
        var stepWidth = $('body').find('#' + step).outerWidth(true);
        coords = self.positionTip($anchor, stepWidth);
        $('body').find('#' + step).css({
          top: coords.top + 'px',
          left: coords.left + 'px'
        }, 'html').fadeIn('fast');
      });
    },

    setupOverlayBG : function() {
      var wH = $(window).height(), wW = $(window).width(), 
      $overlayBg = '<div class="overlay-bg" style="width: '+wW+'px; height: '+wH+'px;" />';
      $('body').prepend($overlayBg).fadeIn();
    },

    positionTip : function($anchor, stepWidth) {
      
      // if($anchor==='stepZero' || $anchor==='stepFive') {
        var wW = $(window).width();
        var anchorLeft = parseInt( ( wW / 2 ) - ( stepWidth / 2 ) ), 
        anchorTop = 100,
        position = 'center';
      // } else {
      //   var anchorLeft = $anchor.offset().left,
      //   anchorTop = $anchor.offset().top,
      //   position = $anchor.data('overlay-position');
      // }
      
      if(position==='left') {
        anchorLeft = parseInt(anchorLeft - stepWidth);
      } else if(position==='right') {
        anchorLeft = parseInt(anchorLeft + $anchor.outerWidth(true));
      }
      var coords = {
        top: anchorTop,
        left: anchorLeft
      };
      return coords;
    },

    skipOverlays : function() {
      // var d = {
      //   userId: this.userId
      // };
      // $.post(this.wsURL + '/User/NoAppHints', d, function() {
      //   $.post('/user/noAppHints', d);
      // });
      var self=this;
      self.$el.find('.overlay-bg').remove();
      this.$el.find('.overlay-element').remove();
    }

  });

  return OverlayView;

});