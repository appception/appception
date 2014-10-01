define(function (require, exports, module) {
  var sync = appshell.MakeDrive.fs().sync;
  var is = {
    get connected() {
      return sync.state === sync.SYNC_CONNECTED;
    },
    get syncing() {
      return sync.state === sync.SYNC_SYNCING;
    }
  }

  function attachListeners(handlers) {
    sync.on("connected", handlers.onConnect);
    sync.on("disconnected", handlers.onDisconnected);
    sync.on("error", handlers.onError);
    sync.on("syncing", handlers.onSyncing);
    sync.on("completed", handlers.onCompleted);
  }

  return {
    attachListeners: attachListeners,
    is: is,
    sync: function() {
      sync.request('/');
    }
  };
});
