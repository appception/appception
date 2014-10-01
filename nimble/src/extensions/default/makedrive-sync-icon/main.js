define(function(require, exports, module) {
  "use strict";
  
  require("lib/vendor/jQueryRotate");
  require("lib/vendor/jquery.easing.min");

  var ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
  var SyncUtil = require('./lib/syncutil');

  var $icon;

  ExtensionUtils.loadStyleSheet(module, "./lib/css/octicons.css");
  ExtensionUtils.loadStyleSheet(module, "./lib/css/style.css");

  var statusBar = brackets.getModule("widgets/StatusBar");

  var rotate = {
    angle: 0,
    intervalTrigger: null,
    start: function(element){
      var that = this;
      var timer = function(){
        return setInterval(function(){
          ++(that.angle);
          element.rotate(that.angle);
        }, 0);
      };
      if(!(that.intervalTrigger)){
        element.css("color", "#007FFF");
        that.intervalTrigger = timer();
      }
    },
    stop: function(element){
      var that = this;
      clearInterval(that.intervalTrigger);
      that.intervalTrigger = null;
      element.rotate({angle: that.angle, animateTo: that.angle + (360 - (that.angle % 360)), easing: $.easing.swing, callback: function() {
        that.angle = 0;
        blink(200, 100, element);
        element.css("color", "green");
      }});
    }
  };

  $icon = $("<div><i id=\"sync-icon\" class=\"mega-octicon octicon-sync\"></i></div>")
    .click(_subMenu);

  statusBar.addIndicator("sync-indicator", $icon, true);

  function _subMenu() {
    SyncUtil.sync();
  }

  function blink(time, interval, element){
    var timer = setInterval(function(){
      element.fadeOut(500);
      element.fadeIn(500);
      setTimeout(function(){
        element.fadeOut(500);
        element.fadeIn(500);
      }, 1000);
    }, interval);
    setTimeout(function(){clearInterval(timer);}, time);
  }

  // Attach listeners
  SyncUtil.attachListeners({
    onConnect: function() {
      // Update UI to show a checkmark
      $('#sync-icon').css("color", "green");
      console.log("We've connected!");
    },
    onDisconnected: function() {
      // Update UI to show a red 'X'
      $('#sync-icon').css("color", "red");
      console.log("We've disconnected!");
    },
    onError: function(err) {
      // Update UI to show a warning symbol
      console.log("Something errored! Here it is: ", err);
    },
    onSyncing: function() {
      // Update UI to show a progress wheel
      rotate.start($('#sync-icon'));
    },
    onCompleted: function() {
      // Update UI to blink slowly, then show a checkmark again
      rotate.stop($('#sync-icon'));
    }
  });
});
