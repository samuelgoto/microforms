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
  let result = {
   hello: "world"
  };
  if (req.accepts("application/microforms")) {
   // resp.set("X-Compatible-Content-Type", "application/microforms");
   resp.type("application/microforms");
   result["<form name='create' method='post'>"] = {
    "<input name='title'>": {},
    "<input name='description'>": {}
   };
  } else {
   resp.type("application/json");
  }
  resp.json(result);
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