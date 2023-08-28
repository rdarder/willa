const { createProxyMiddleware } = require("http-proxy-middleware");
console.log("setupProxy.js");

module.exports = function (app) {
  app.use("/controller", createProxyMiddleware("ws://localhost:5000"));
};
