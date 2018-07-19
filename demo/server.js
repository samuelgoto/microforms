const express = require('express');
const app = express();

app.get('/', (req, res) => {
  // console.log("hi");
  // res.contentType("application/json");
  // res.send('Hello World, foo bar!');
  res.type("json");
  res.json({hello: "world"});
 });

exports.listen = function(opt_port) {
 const port = process.env.PORT || opt_port;
 this.server = app.listen(port, () => {
   console.log(`listening on port ${port}!`)
  });
};

exports.close = function() {
 this.server.close();
};