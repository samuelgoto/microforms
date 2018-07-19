const express = require('express');
const app = express();

app.get('/', (req, resp) => {
  // console.log("hi");
  // res.contentType("application/json");
  // res.send('Hello World, foo bar!');
  // console.log(req.get("Accept"));
  // console.log("hi");
  // console.log();
  // console.log("hey");
  let accepts = req.accepts(["application/microforms", "application/json"]);
  if (accepts) {
   resp.type(accepts);
  } else {
   resp.type("text/plain");
  }
  resp.json({hello: "world"});
 });

exports.listen = function(opt_port) {
 const port = process.env.PORT || opt_port;
 this.server = app.listen(port, () => {
   // console.log(`listening on port ${port}!`)
  });
};

exports.close = function() {
 this.server.close();
};