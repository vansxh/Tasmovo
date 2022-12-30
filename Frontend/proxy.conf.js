const PROXY_CONFIG = {
  "/Backend": {
      "target": "https://www.tasmovo.at",
      "changeOrigin": true,
      "secure": false,
      "logLevel": "debug"
 }
};
module.exports = PROXY_CONFIG;
