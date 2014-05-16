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
    crypto = require("crypto"),
    debug = require("debug")("koa-app");
    

var proto = koa.prototype;


proto.configure = function(options) {
  var app = this;
  
  debug("configure");
  options = options || {};
  if(!options.generateKey) {
    // generate rotation keys for sign
    app.keys = (function(i) {
      var ret = [];
      while(i--) {
        ret.push(crypto.randomBytes(256).toString());
      }
      return ret;
    }(3));
  }
  
  app.use(gzip());
  app.use(bodyparser());
  app.use(methodOverride());
  
  locals(app);
  locale(app);
  
  if(options.i18n) {
    app.use(i18n(app, options.i18n));
  }
  
  if(options.session) {
    app.use(session(options.session));
  }
  
  app.use(flash());
  
  if(options.statics) {
    options.statics.forEach(function(s) {
      app.use(statics(s));
    });
  }
  
};

module.exports = koa;