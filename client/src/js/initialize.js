import log from 'loglevel';


function logInit() {
  // define customized log format
  var originalFactory = log.methodFactory;
  log.methodFactory = function(methodName, logLevel, loggerName) {
    var originalLogMethod = originalFactory(methodName, logLevel, loggerName);
    loggerName = loggerName === undefined ? 'root' : loggerName;
    var prefix = '[' + loggerName + '-' + methodName + ']';
    return function() {
      var args = [].slice.call(arguments);
      args.unshift(prefix);
      originalLogMethod.apply(this, args);
    };
  };

  // set default log levels
  if (__DEV__) {
    log.setLevel('info');
  } else {
    log.setLevel('warn');
  }

  // add a global logger() to be used by other modules
  window.logger = function(name) {
    var new_logger = log.getLogger(name);
    // if in production, set new logger's level to the default level and make 
    // setLevel() of the logger a no-op
    if (!__DEV__) {
      new_logger.setLevel(log.getLevel());
      new_logger.setLevel = function() { return; }
    }
    return new_logger;
  };
}

/**
 * A central initialization function.
 *
 * All initialization of the app is supposed to be done here, including logging 
 * initialization, browser compatibility check, etc.
 */
function initialize() {
  if (__DEV__) {
    console.warn('FRONTEND_DEBUG:', __DEV__);
  }
  logInit();
}

initialize();
