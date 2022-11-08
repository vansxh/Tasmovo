const PROXY_CONFIG = {
  "/Backend": {
      "target": "http://flock-1902.students.fhstp.ac.at",
      "changeOrigin": true,
      "secure": false,
      "logLevel": "debug"
 }
};
module.exports = PROXY_CONFIG;