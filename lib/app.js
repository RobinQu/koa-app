/*jshint esnext:true */

var koa = require("koa"),
    co = require("co"),
    session = require("koa-sess"),
    bodyparser = require("koa-body"),
    methodOverride = require("koa-methodoverride"),
    locals = require("koa-locals"),
    locale = require("koa-locale"),
    flash = require("koa-flash"),
    i18n = require("koa-i18n"),
    gzip = require("koa-gzip"),
    thunkify = require("thunkify"),
    statics = require("koa-static"),
    http = require("http"),
    https = require("https"),
    crypto = require("crypto"),
    assert = require("assert"),
    debug = require("debug")("koa-app");
    

var proto = koa.prototype;


proto.listen = function(options, callback) {
  var srv, sockets = [], port;
  
  //normalize `options`
  if(typeof options === "number") {
    port = options;
    options = {};
  } else {
    port = options.port;
  }
  assert(port, "should have port defined");
  
  if(options.secured) {
    assert(options.certs, "should provide certs");
    srv = https.createServer(options.certs, this.callback());
  } else {
    srv = http.createServer(this.callback());
  }
  
  if(options.autoDrop) {
    debug("listen for connection");
    srv.on("connection", function(socket) {
      debug("connection", this.name);
      sockets.push(socket);
      socket.once("close", function() {
        debug("socket close");
        sockets.splice(sockets.indexOf(socket), 1);
      });
    });
  }
  
  this.server = srv;
  
  srv.listen(options.port, callback);
  
  return srv;
};

proto.configure = function(options) {
  var app = this;
  
  debug("configure");
  options = options || {};
  if(options.generateKey) {
    debug("generate key");
    // generate rotation keys for sign
    app.keys = (function(i) {
      var ret = [];
      while(i--) {
        ret.push(crypto.randomBytes(256).toString());
      }
      return ret;
    }(3));
  }
  
  app.name = options.name || "";
  
  app.use(gzip());
  app.use(bodyparser());
  app.use(methodOverride("_method"));
  
  locals(app);
  
  if(options.i18n) {
    debug("setup i18n");
    locale(app);
    app.use(i18n(app, options.i18n));
  }
  
  if(options.session) {
    debug("setup session");
    app.use(session(options.session));
    
    //TODO: give a chance to configure
    app.use(flash());
  }
  
  if(options.statics) {
    debug("setup static");
    options.statics.forEach(function(s) {
      app.use(statics(s));
    });
  }
  
  app.on("error", function(e) {
    console.log("App error: %s", e.message);
    var env = process.env.NODE_ENV || "development";
    if(env !== "test") {
      console.error(e.stack);
      if(e.errors) {//possibly validation errors
        console.error(e.errors);
      }
    } else {
      if(e.stack) {
        debug("stack %s", e.stack.split("\n")[0]);
      }
      if(e.errors) {
        var key;
        for(key in e.errors) {
          debug("%s", e.errors[key].message);
        }
      }
    }
  });
  
};

module.exports = koa;