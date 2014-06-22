# koa-app

An opinionated selection of koa middlewares/plugins to boost the project scaffolding.


忍受不了每次新建一个koa应用都要不断的去`npm install`各种`middlewares`，那就试试这个吧。

我不做框架，只做大自然的搬运工！


## Bundled Middlewares

* koa-body
* koa-flash
* koa-gzip
* koa-i18n
* koa-locale
* koa-locals
* koa-methodoverride
* koa-sess
* koa-static

## Usage

```js
var koa = require("koa-app");
var app = koa();

//important!
app.configure({
  
  //static file folders to be hosted
  statics: ["folder1", "folder2"],
  
  // options passed to `koa-sess`
  session: {},
  
  //optiosn passed to `koa-i18n`
  i18n: {}
  
  //if we should generate random `app.keys` for you
  generateKey: true
  
  
});

app.listen({
  // bind port
  port: 8080,
  
  // using SSL or not
  secured: true,
  
  // should provide cert and private key content
  certs: {
    key: "xxxx",
    cert: xxx
  },
  
  // force to drop all socket connections on `server.close()`
  autoDrop: true
  
}, function() {
  console.log("app is up and running");
});

```

## License

See [LICENSE](./LICENSE)